"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { Role, ServerFuncRes } from "@/types";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function EditUserRole(
  email: string,
  newRole: Role,
): Promise<ServerFuncRes> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.admin)
    return { success: false, message: "unauthorized. please sign in again." };
  if (user.email === email)
    return { success: false, message: "you cannot change your own role." };

  const usersCollection = await getCollection(USERS_COLLECTION);
  const res = await usersCollection.updateOne(
    { email },
    { $set: { role: newRole } },
  );
  if (res.modifiedCount === 0)
    return {
      success: false,
      message: "could not update user. please try again later.",
    };

  return {
    success: true,
    message: `successfully updated ${email} to ${newRole}`,
  };
}
