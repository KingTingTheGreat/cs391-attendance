"use server";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { AttendanceProps, Class, PresentResult, Role } from "@/types";
import { formatDate, formatDay } from "../util/format";
import { ENV, MOCK } from "../env";
import { addToAttendanceList } from "../util/addToAttendanceList";
import { jwtDataFromAuthCookie } from "../cookies/jwtDataFromAuthCookie";
import tempCodeToClass from "../code/tempCodeToClass";
import todayCodeToClass from "../code/todayCodeToClass";
import getUsersByRole from "../util/getUsersByRole";

export default async function markAsPresent(
  code: string,
  onlyScan?: boolean,
): Promise<PresentResult> {
  console.log("mark as present");
  const today = new Date();
  const formatToday = formatDate(today);

  const cookieStore = await cookies();
  const claims = await jwtDataFromAuthCookie(cookieStore);
  if (!claims) {
    console.error("user not signed in claiming to be present");
    return {
      errorMessage: "something went wrong. please sign in again.",
    };
  }

  console.log(
    claims.name,
    "claiming to be present on",
    formatDay(today),
    formatToday,
  );

  if (ENV === "dev" && MOCK) {
    return { newAtt: { class: Class.lecture, date: today } };
  }

  const emails = (await getUsersByRole([Role.staff, Role.admin])).map(
    (user) => user.email,
  );

  let newAtt: AttendanceProps | null = null;
  if (!onlyScan) {
    const data = todayCodeToClass(code, emails);
    if (data) {
      newAtt = {
        class: data.classType,
        date: today,
        performedBy: claims.email,
        permittedBy: data.email,
      };
    }
  }
  if (newAtt === null) {
    const data = tempCodeToClass(code, emails, onlyScan);
    if (!data) {
      console.log(claims.name, "tried with incorrect code");
      return {
        errorMessage: "incorrect code",
      };
    }

    newAtt = {
      class: data.classType,
      date: today,
      performedBy: claims.email,
      permittedBy: data.email,
    };
  }

  console.log(
    `starting transaction to mark ${claims.name} as present in ${newAtt.class} on ${formatToday}`,
  );

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email: claims.email });
    if (!data) throw new Error(`user with email ${claims.email} not found`);

    const attendanceList = data.attendanceList as AttendanceProps[];
    if (
      attendanceList.some(
        (att) =>
          formatDate(att.date) === formatToday && att.class === newAtt.class,
      )
    ) {
      throw new Error(
        `you have already been marked present in ${newAtt.class} today`,
      );
    }
    addToAttendanceList(attendanceList, newAtt);

    data = await usersCollection.findOneAndUpdate(
      { email: claims.email },
      {
        $set: {
          attendanceList,
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!data) {
      throw new Error(
        "something went wrong on our end. please try again and notify the instructor.",
      );
    }
    session.commitTransaction();
  } catch (error) {
    console.log("CAUGHT ERROR WITH TRANSACTION");
    let message = "something went wrong. please try again later.";
    if (error instanceof Error) {
      console.error("error message:", error.message);
      message = error.message;
    }
    await session.abortTransaction();
    return {
      errorMessage: message,
    };
  } finally {
    await session.endSession();
  }

  return { newAtt };
}
