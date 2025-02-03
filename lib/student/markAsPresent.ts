"use server";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { AttendanceProps, Class } from "@/types";
import { formatDate, formatDay } from "../util/format";
import { todayCode } from "../generateCode";
import {
  CLASS_COORDS,
  CLASS_DAYS,
  DISABLE_DAY_CHECKING,
  ENV,
  LECTURE_DAYS,
  MAX_ALLOWED_DISTANCE,
  MOCK,
} from "../env";
import { getDistance } from "geolib";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { getFromCache, setUserInCache } from "../cache/redis";
import documentToUserProps from "../util/documentToUserProps";

export default async function markAsPresent(
  code: string,
  longitude?: number,
  latitude?: number,
): Promise<string | null> {
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
      return "why are you here? there's no class today";
    }
  }

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    console.error("no user");
    return "something went wrong. please sign in again.";
  } else if (
    // MAYBE DELETE THIS LATER
    user.attendanceList.length > 0 &&
    formatDate(user.attendanceList[user.attendanceList.length - 1].date) ===
      formatToday
  ) {
    console.error("already marked as present");
    return "you have already been marked present for today";
  }

  if (code.toUpperCase() !== todayCode()) {
    // check for temporary code
    if (!(await getFromCache(code.toUpperCase()))) {
      console.error("incorrect code: ", code.toUpperCase());
      return "incorrect code";
    }
  }

  console.log("long, lat: ", longitude, latitude);
  // only check student location if max allowed distance is not negative and they have granted permission
  if (MAX_ALLOWED_DISTANCE >= 0 && longitude && latitude) {
    const d = getDistance({ longitude, latitude }, CLASS_COORDS);
    console.log(`${user.email} is ${d} meters away from class`);
    if (d > MAX_ALLOWED_DISTANCE) {
      console.error(
        `student: ${user.email} is too far from class. they are ${d} meters away and max allowed distance is ${MAX_ALLOWED_DISTANCE} meters`,
      );
      return `you are too far from class: ${d} meters`;
    }
  }

  if (ENV === "dev" && MOCK) {
    return null;
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
                  ? Class.Lecture
                  : Class.Discussion,
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
    setUserInCache(documentToUserProps(data));
  } catch (error) {
    console.log("CAUGHT ERROR");
    let message = "something went wrong. please try again later.";
    if (error instanceof Error) {
      console.error("error message:", error.message);
      message = error.message;
    }
    await session.abortTransaction();
    return message;
  } finally {
    await session.endSession();
  }

  return null;
}
