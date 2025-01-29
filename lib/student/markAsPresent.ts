"use server";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { AttendanceProps, Class, DayEnum, Role } from "@/types";
import { formatDate, formatDay } from "../util/format";
import { generateCode } from "../generateCode";
import {
  CLASS_COORDS,
  DISABLE_DAY_CHECKING,
  ENV,
  MAX_ALLOWED_DISTANCE,
  MOCK,
} from "../env";
import { getDistance } from "geolib";
import { userFromCookie } from "../cookies/userFromCookie";
import { setCacheCookie } from "../cookies/cache";

const classDays = [DayEnum.tuesday, DayEnum.thursday];

export default async function markAsPresent(
  code: string,
  longitude?: number,
  latitude?: number,
): Promise<string | null> {
  console.log("mark as present");
  const today = new Date();
  if (!DISABLE_DAY_CHECKING) {
    if (!classDays.includes(formatDay(today))) {
      console.error("studenting claiming to be present on", formatDay(today));
      return "why are you here? there's no class today";
    }
  }

  const cookieStore = await cookies();
  const user = await userFromCookie(cookieStore);
  if (!user) {
    console.error("no user");
    return "something went wrong. please sign in again.";
  } else if (
    user.attendanceList.length > 0 &&
    formatDate(user.attendanceList[user.attendanceList.length - 1].date) ===
      formatDate(today)
  ) {
    console.error("already marked as present");
    return "you have already been marked present for today";
  }

  if (code.toUpperCase() !== generateCode()) {
    console.error("incorrect code: ", code.toUpperCase());
    return "incorrect code";
  }

  console.log("long, lat: ", longitude, latitude);
  // only check student location if max allowed distance is not negative and they have granted permission
  if (MAX_ALLOWED_DISTANCE >= 0 && longitude && latitude) {
    const d = getDistance({ longitude, latitude }, CLASS_COORDS);
    console.log("student is " + d + " meters away from class");
    if (d > MAX_ALLOWED_DISTANCE) {
      console.error(
        `student: ${user.email} is too far from class. they are ${d} meters away and max allowed distance is ${MAX_ALLOWED_DISTANCE} meters`,
      );
      return "something went wrong on our end. please try again and notify the instructor.";
    }
  }

  if (ENV === "dev" && MOCK) {
    return null;
  }

  const usersCollections = await getCollection(USERS_COLLECTION);
  const data = await usersCollections.findOneAndUpdate(
    { email: user.email },
    {
      // @ts-expect-error weird mongo linting?
      $push: {
        attendanceList: {
          class: Class.Lecture,
          date: today,
        },
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (!data) {
    return "something went wrong on our end. please try again and notify the instructor.";
  }

  setCacheCookie(
    {
      name: data.name,
      email: data.email,
      picture: data.picture,
      role: data.role as Role,
      attendanceList: data.attendanceList as AttendanceProps[],
    },
    undefined,
    cookieStore,
  );
  return null;
}
