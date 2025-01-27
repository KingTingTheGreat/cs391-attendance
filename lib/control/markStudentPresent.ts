"use server";
import { Class, Role, ServerFuncRes } from "@/types";
import { userFromCookies } from "../cookies";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function markStudentPresent(
  email: string,
  date: Date,
): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user)
    return { success: false, message: "unauthorized. please sign in again." };
  else if (user.role !== Role.staff && user.role !== Role.admin)
    return { success: false, message: "unauthorized. please sign in again." };

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
    message: `successfully marked ${email} as present`,
  };
}
