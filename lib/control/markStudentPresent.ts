"use server";
import { AttendanceProps, Class, Role } from "@/types";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { formatDate, formatDay } from "../util/format";
import { DISCUSSION_DAYS, ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import documentToUserProps from "../util/documentToUserProps";
import { addDateToCache, setUserInCache } from "../cache/redis";
import { addToAttendanceList } from "../util/addToAttendanceList";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentPresent(
  email: string,
  date: Date | null,
): Promise<string> {
  if (date === null || isNaN(date.getTime())) {
    throw new Error("invalid date");
  }

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("unauthorized. please sign in again.");
  }

  if (ENV === "dev" && MOCK) {
    return `successfully marked ${email} as absent on ${formatDate(date)}`;
  }

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email });
    if (!data) throw new Error(`user with email ${email} was not found`);

    const attendanceList = data.attendanceList as AttendanceProps[];
    addToAttendanceList(attendanceList, {
      class: DISCUSSION_DAYS.includes(formatDay(date))
        ? Class.discussion
        : Class.lecture,
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
    await addDateToCache(
      DISCUSSION_DAYS.includes(formatDay(date))
        ? Class.discussion
        : Class.lecture,
      formatDay(date),
    );
    await session.commitTransaction();

    console.log("SUCCESSFULLY MARKED PRESENT");
    await setUserInCache(documentToUserProps(data));
    return `successfully marked ${email} as present on ${formatDate(date)}`;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
