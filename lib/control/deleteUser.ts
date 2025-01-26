"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function deleteUser(email: string): Promise<boolean> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.admin) return false;
  if (user.email === email) return false;

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.deleteOne({
    email,
    role: { $ne: Role.admin }, // cannot delete admin users
  });
  return res.deletedCount > 0;
}
