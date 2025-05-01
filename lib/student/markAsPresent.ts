"use server";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { AttendanceProps, Class, PresentResult } from "@/types";
import { formatDate, formatDay } from "../util/format";
import { todayCode } from "../generateCode";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { addDateToCache, getFromCache, setUserInCache } from "../cache/redis";
import documentToUserProps from "../util/documentToUserProps";
import { addToAttendanceList } from "../util/addToAttendanceList";

export default async function markAsPresent(
  code: string,
): Promise<PresentResult> {
  console.log("mark as present");
  const today = new Date();
  const formatToday = formatDate(today);

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    console.error("user not signed in claiming to be present");
    return {
      errorMessage: "something went wrong. please sign in again.",
    };
  }

  console.log(
    user.name,
    "claiming to be present on",
    formatDay(today),
    formatToday,
  );

  if (ENV === "dev" && MOCK) {
    return { newAtt: { class: Class.lecture, date: today } };
  }

  let newAtt: AttendanceProps | null = null;
  for (const classType in Class) {
    if (code.toUpperCase() === todayCode(classType as Class)) {
      newAtt = {
        class: classType as Class,
        date: today,
      };
      break;
    }
  }
  if (newAtt === null) {
    // check for temporary code
    const classType = await getFromCache(code.toUpperCase());
    if (!classType) {
      console.log(user.name, "tried with incorrect code");
      return {
        errorMessage: "incorrect code",
      };
    }

    newAtt = {
      class: classType as Class,
      date: today,
    };
  }

  // maybe avoid call to mongo based on cache user state
  if (
    user.attendanceList.some(
      (att) =>
        formatDate(att.date) === formatToday && att.class === newAtt.class,
    )
  ) {
    return {
      errorMessage: `you have already been marked present in ${newAtt.class} today`,
    };
  }

  console.log(
    `starting transaction to mark ${user.name} as present in ${newAtt.class} on ${formatToday}`,
  );

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email: user.email });
    if (!data) throw new Error(`user with email ${user.email} not found`);

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
      { email: user.email },
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
    await Promise.all([
      session.commitTransaction(),
      addDateToCache(newAtt.class, formatToday),
      setUserInCache(documentToUserProps(data)),
    ]);
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
