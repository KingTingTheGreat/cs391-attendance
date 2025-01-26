"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function EditUserRole(
  email: string,
  newRole: Role,
): Promise<string> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.admin)
    return "unauthorized. please sign in again.";
  if (user.email === email) return "you cannot change your own role.";

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.updateOne(
    { email },
    { $set: { role: newRole } },
  );
  if (res.modifiedCount === 0)
    return "could not update user. please try again later.";

  return "successfully updated user";
}
