"use server";
import { Role, ServerFuncRes, UserProps } from "@/types";
import { userFromCookies } from "../cookies";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { DEFAULT_ROLE, ENV, MOCK } from "../env";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentAbsent(
  email: string,
  date: Date,
): Promise<ServerFuncRes> {
  let user: UserProps | null = null;

  if (ENV !== "dev" || DEFAULT_ROLE === undefined) {
    const cookieStore = await cookies();
    user = await userFromCookies(cookieStore);

    if (!user || !allowedRoles.includes(user.role)) {
      return { success: false, message: "unauthorized. please sign in again." };
    }
  } else if (!allowedRoles.includes(DEFAULT_ROLE)) {
    return { success: false, message: "unauthorized. please sign in again." };
  }

  if (ENV === "dev" && MOCK) {
    return {
      success: true,
      message: `successfully marked ${email} as absent on ${formatDate(date)}`,
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
      // @ts-expect-error weird mongo linting?
      $pull: {
        attendanceList: {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
    },
  );
  if (res.modifiedCount === 0)
    return {
      success: false,
      message: "could not mark student as absent. please try again later.",
    };

  return {
    success: true,
    message: `successfully marked ${email} as absent on ${formatDate(date)}`,
  };
}
