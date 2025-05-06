"use server";
import { cookies } from "next/headers";
import { Role, ServerFuncRes } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";
import { ENV, MOCK } from "../env";
import { deleteFromCache } from "../cache/redis";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

const allowedRoles = [Role.admin];

export async function deleteUser(email: string): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return { success: false, message: "unauthorized. please sign in again." };
  } else if (dbData.user.email === email) {
    return { success: false, message: "you cannot delete yourself" };
  }

  if (ENV === "dev" && MOCK) {
    console.log("successful delete");
    return { success: true, message: `successfully deleted ${email}` };
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.deleteOne({
    email,
    role: { $ne: Role.admin }, // cannot delete admin users
  });
  if (res.deletedCount === 0)
    return {
      success: false,
      message: "could not delete user. try again later.",
    };

  await deleteFromCache(email);

  return { success: true, message: `successfully deleted ${email}` };
}
