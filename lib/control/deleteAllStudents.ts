"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role, ServerFuncRes, UserProps } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";
import { DEFAULT_ROLE, ENV, MOCK } from "../env";

const allowedRoles = [Role.admin];

export async function deleteAllStudents(): Promise<ServerFuncRes> {
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

  return { success: true, message: "successfully deleted all students" };
}
