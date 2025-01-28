"use server";
import { Class, Role, ServerFuncRes } from "@/types";
import { userFromCookies } from "../cookies";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentPresent(
  email: string,
  date: Date | null,
): Promise<ServerFuncRes> {
  if (date === null || isNaN(date.getTime())) {
    return { success: false, message: "invalid date" };
  }

  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, message: "unauthorized. please sign in again." };
  }

  if (ENV === "dev" && MOCK) {
    return {
      success: true,
      message: `successfully marked ${email} as present on ${formatDate(date)}`,
    };
  }
  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.updateOne(
    { email },
    {
      // @ts-expect-error weird mongo linting?
      $push: {
        attendanceList: {
          $each: [
            {
              class: Class.Lecture,
              date,
            },
          ],
          $sort: 1,
        },
      },
    },
  );
  if (res.modifiedCount === 0)
    return {
      success: false,
      message: "could not mark student as present. please try again later.",
    };

  return {
    success: true,
    message: `successfully marked ${email} as present on ${formatDate(date)}`,
  };
}
