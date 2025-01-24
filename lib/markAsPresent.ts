"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "./cookies";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Class } from "@/types";
import { formatDate } from "./attendanceList";

export default async function markAsPresent(): Promise<boolean> {
  console.log("mark as present");
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  const today = new Date();

  if (!user) {
    console.error("no user");
    return false;
  } else if (
    user.attendanceList &&
    formatDate(user.attendanceList[user.attendanceList.length - 1].date) ===
      formatDate(today)
  ) {
    console.error("already marked as present");
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
