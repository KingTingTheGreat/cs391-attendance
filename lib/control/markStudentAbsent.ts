"use server";
import { Class, MarkResult, Role } from "@/types";
import { cookies } from "next/headers";
import getCollection, { USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";
import documentToUserProps from "../util/documentToUserProps";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentAbsent(
  email: string,
  date: Date,
  classType: Class,
): Promise<MarkResult> {
  if (isNaN(date.getTime())) {
    return { message: "invalid date" };
  }

  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return { message: "unauthorized. please sign in again." };
  }

  // no way to get user data when MOCK, will show as error in the frontend
  if (ENV === "dev" && MOCK) {
    return {
      message: `successfully marked ${email} as absent on ${formatDate(date)}`,
    };
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
          class: classType,
        },
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (!data) {
    return {
      message: "could not mark student as absent. please try again later.",
    };
  }

  const updatedUser = documentToUserProps(data);

  return {
    user: updatedUser,
    message: `successfully marked ${email} as absent on ${formatDate(date)}`,
  };
}
