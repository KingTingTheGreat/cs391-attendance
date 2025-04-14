"use server";
import { Role } from "@/types";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import documentToUserProps from "../util/documentToUserProps";
import { setUserInCache } from "../cache/redis";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentAbsent(
  email: string,
  date: Date,
): Promise<string> {
  if (isNaN(date.getTime())) {
    throw new Error("invalid date");
  }

  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("unauthorized. please sign in again.");
  }

  if (ENV === "dev" && MOCK) {
    return `successfully marked ${email} as absent on ${formatDate(date)}`;
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const usersCollection = await getCollection(USERS_COLLECTION);
  const data = await usersCollection.findOneAndUpdate(
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
    {
      returnDocument: "after",
    },
  );
  if (!data) {
    throw new Error(
      "could not mark student as absent. please try again later.",
    );
  }

  await setUserInCache(documentToUserProps(data));

  return `successfully marked ${email} as absent on ${formatDate(date)}`;
}
