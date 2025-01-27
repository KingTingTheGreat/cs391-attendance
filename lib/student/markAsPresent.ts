"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Class } from "@/types";
import { formatDate } from "../util/format";
import { generateCode } from "../generateCode";

export default async function markAsPresent(
  code: string,
): Promise<string | null> {
  console.log("mark as present");
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  const today = new Date();

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

  return res.modifiedCount === 1
    ? null
    : "something went wrong on our end. please try again and notify the instructor.";
}
