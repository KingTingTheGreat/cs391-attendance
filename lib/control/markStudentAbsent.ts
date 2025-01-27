"use server";
import { Role, ServerFuncRes } from "@/types";
import { userFromCookies } from "../cookies";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";

export async function markStudentAbsent(
  email: string,
  date: Date,
): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user)
    return { success: false, message: "unauthorized. please sign in again." };
  else if (user.role !== Role.staff && user.role !== Role.admin)
    return { success: false, message: "unauthorized. please sign in again." };

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
