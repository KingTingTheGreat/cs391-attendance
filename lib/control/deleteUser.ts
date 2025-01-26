"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role, ServerFuncRes } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function deleteUser(email: string): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.admin)
    return { success: false, message: "unauthorized. please sign in again." };
  if (user.email === email)
    return { success: false, message: "you cannot delete yourself" };

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.deleteOne({
    email,
    role: { $ne: Role.admin }, // cannot delete admin users
  });
  if (res.deletedCount === 0)
    return {
      success: false,
      message: "could not delete user. please try again later.",
    };

  return { success: true, message: `successfully deleted ${email}` };
}
