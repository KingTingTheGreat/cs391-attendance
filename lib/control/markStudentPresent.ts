"use server";
import { Class, Role, ServerFuncRes } from "@/types";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";
import { userFromCookie } from "../cookies/userFromCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentPresent(
  email: string,
  date: Date | null,
): Promise<ServerFuncRes> {
  if (date === null || isNaN(date.getTime())) {
    return { success: false, message: "invalid date" };
  }

  const cookieStore = await cookies();
  const user = await userFromCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, message: "unauthorized. please sign in again." };
  }

  if (ENV === "dev" && MOCK) {
    return {
      success: true,
      message: `successfully marked ${email} as present on ${formatDate(date)}`,
    };
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.updateOne(
    { email },
    {
      // remove previous attendance marking for this date
      // @ts-expect-error weird mongo linting?
      $pull: {
        attendanceList: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      // @ts-expect-error weird mongo linting?
      $push: {
        attendanceList: {
          $each: [
            {
              class: Class.Lecture,
              date,
            },
          ],
          $sort: { date: 1 },
        },
      },
    },
  );
  if (res.modifiedCount === 0) {
    return {
      success: false,
      message: `could not mark ${email} as present. please try again later`,
    };
  }

  return {
    success: true,
    message: `successfully marked ${email} as present on ${formatDate(date)}`,
  };
}
