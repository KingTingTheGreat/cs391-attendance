"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Role, UserProps } from "@/types";
import { mockStudents } from "../mockStudents";
import { cookies } from "next/headers";
import { userFromCookies } from "../cookies";
import { redirect } from "next/navigation";
import { DEFAULT_ROLE, ENV, MOCK } from "../env";

const allowedRoles = [Role.staff, Role.admin];

export async function allUsers(): Promise<UserProps[]> {
  let user: UserProps | null = null;

  if (ENV !== "dev" || DEFAULT_ROLE === undefined) {
    const cookieStore = await cookies();
    user = await userFromCookies(cookieStore);

    if (!user || !allowedRoles.includes(user.role)) {
      // only allow staff and admin to access this data
      return redirect("/");
    }
  } else if (!allowedRoles.includes(DEFAULT_ROLE)) {
    return redirect("/");
  }

  if (ENV === "dev" && MOCK) {
    return mockStudents();
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const users = await usersCollection.find().toArray();

  return users.map((user) => ({
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
    attendanceList: user.attendanceList,
  }));
}
