"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function deleteAllStudents(): Promise<boolean> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.admin) return false;

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.deleteMany({ role: Role.student });
  return res.acknowledged;
}
