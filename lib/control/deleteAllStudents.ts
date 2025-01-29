"use server";
import { cookies } from "next/headers";
import { Role, ServerFuncRes } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { clearCache } from "../cache/redis";

const allowedRoles = [Role.admin];

export async function deleteAllStudents(): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, message: "unauthorized. please sign in again." };
  }

  if (ENV === "dev" && MOCK) {
    return { success: true, message: "successfully deleted all students" };
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.deleteMany({ role: Role.student });
  if (!res.acknowledged) {
    return {
      success: false,
      message: "could not delete students. please try again later.",
    };
  }

  await clearCache();

  return { success: true, message: "successfully deleted all students" };
}
