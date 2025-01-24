"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "./cookies";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Class } from "@/types";

export default async function markAsPresent(): Promise<boolean> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  const today = new Date();

  if (!user) {
    return false;
  } else if (
    user.attendanceList &&
    user.attendanceList[user.attendanceList.length - 1].date.getDate() ===
      today.getDate()
  ) {
    return false;
  }

  const usersCollections = await getCollection(USERS_COLLECTION);
  const res = await usersCollections.updateOne(
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
  );

  return res.acknowledged;
}
