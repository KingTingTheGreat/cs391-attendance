"use server";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { AttendanceProps, Class } from "@/types";
import { formatDate, formatDay } from "../util/format";
import { todayCode } from "../generateCode";
import {
  CLASS_DAYS,
  DISABLE_DAY_CHECKING,
  ENV,
  LECTURE_DAYS,
  MOCK,
} from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { addDateToCache, getFromCache, setUserInCache } from "../cache/redis";
import documentToUserProps from "../util/documentToUserProps";

export default async function markAsPresent(
  code: string,
): Promise<AttendanceProps> {
  console.log("mark as present");
  const today = new Date();
  const formatToday = formatDate(today);
  if (!DISABLE_DAY_CHECKING) {
    if (!CLASS_DAYS.includes(formatDay(today))) {
      console.error(
        "student claiming to be present on",
        formatDay(today),
        formatToday,
      );
      throw new Error("why are you here? there's no class today");
    }
  }

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    console.error("no user");
    throw new Error("something went wrong. please sign in again.");
  }

  if (user.attendanceList.some((att) => formatDate(att.date) === formatToday)) {
    console.error("already marked as present");
    throw new Error("you have already been marked present today");
  }

  if (code.toUpperCase() !== todayCode()) {
    // check for temporary code
    if (!(await getFromCache(code.toUpperCase()))) {
      console.error("incorrect code: ", code.toUpperCase());
      throw new Error("incorrect code");
    }
  }

  if (ENV === "dev" && MOCK) {
    return {
      class: LECTURE_DAYS.includes(formatDay(today))
        ? Class.lecture
        : Class.discussion,
      date: today,
    };
  }

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email: user.email });
    if (!data) throw new Error(`user with email ${user.email} not found`);

    const attendanceList = data.attendanceList as AttendanceProps[];
    if (attendanceList.some((att) => formatDate(att.date) === formatToday)) {
      throw new Error("you have already been marked present for today");
    }

    data = await usersCollection.findOneAndUpdate(
      { email: user.email },
      {
        // @ts-expect-error weird mongo linting?
        $push: {
          attendanceList: {
            $each: [
              {
                class: LECTURE_DAYS.includes(formatDay(today))
                  ? Class.lecture
                  : Class.discussion,
                date: today,
              },
            ],
            $sort: { date: 1 },
          },
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

    await session.commitTransaction();
    await setUserInCache(documentToUserProps(data));
  } catch (error) {
    console.log("CAUGHT ERROR");
    let message = "something went wrong. please try again later.";
    if (error instanceof Error) {
      console.error("error message:", error.message);
      message = error.message;
    }
    await addDateToCache(
      LECTURE_DAYS.includes(formatDay(today))
        ? Class.lecture
        : Class.discussion,
      formatToday,
    );
    await session.abortTransaction();
    throw new Error(message);
  } finally {
    await session.endSession();
  }

  return {
    class: LECTURE_DAYS.includes(formatDay(today))
      ? Class.lecture
      : Class.discussion,
    date: today,
  };
}
