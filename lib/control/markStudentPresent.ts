"use server";
import { AttendanceProps, Class, Role, ServerFuncRes } from "@/types";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import documentToUserProps from "../util/documentToUserProps";
import { setToCache } from "../cache/redis";
import { addToAttendanceList } from "../util/addToAttendanceList";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentPresent(
  email: string,
  date: Date | null,
): Promise<ServerFuncRes> {
  if (date === null || isNaN(date.getTime())) {
    return { success: false, message: "invalid date" };
  }

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, message: "unauthorized. please sign in again." };
  }

  if (ENV === "dev" && MOCK) {
    return {
      success: true,
      message: `successfully marked ${email} as present on ${formatDate(date)}`,
    };
  }

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email });
    if (!data) throw new Error(`user with email ${email} was not found`);

    const attendanceList = data.attendanceList as AttendanceProps[];
    addToAttendanceList(attendanceList, {
      class: Class.Lecture,
      date,
    });

    // const usersCollection = await getCollection(USERS_COLLECTION);
    data = await usersCollection.findOneAndUpdate(
      { email },
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
        `could not mark ${email} as present. please try again later`,
      );
    }
    await session.commitTransaction();

    console.log("SUCCESSFULLY MARKED PRESENT");
    setToCache(documentToUserProps(data));
    return {
      success: true,
      message: `successfully marked ${email} as present on ${formatDate(date)}`,
    };
  } catch (error) {
    console.log("CAUGHT ERROR");
    let message = `could not mark ${email} as present. please try again later.`;
    if (error instanceof Error) {
      message = error.message;
    }
    await session.abortTransaction();
    return {
      success: false,
      message,
    };
  } finally {
    await session.endSession();
  }
}
