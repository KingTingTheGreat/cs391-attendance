"use server";
import { cookies } from "next/headers";
import { Role } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { deleteFromCache } from "../cache/redis";

const allowedRoles = [Role.admin];

export async function editUserRole(
  email: string,
  newRole: Role,
): Promise<string> {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("unauthorized. please sign in again.");
  } else if (user.email === email) {
    throw new Error("you cannot change your own role");
  }

  if (ENV === "dev" && MOCK) {
    return `successfully updated ${email} to ${newRole}`;
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.updateOne(
    { email },
    { $set: { role: newRole } },
  );
  if (res.modifiedCount === 0)
    throw new Error("could not update user. please try again later.");

  await deleteFromCache(email);

  return `successfully updated ${email} to ${newRole}`;
}
