"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Role, UserProps } from "@/types";
import { mockStudents } from "../mockStudents";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ENV, MOCK } from "../env";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function getAllUsers(): Promise<UserProps[]> {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to access this data
    return redirect("/");
  }

  if (ENV === "dev" && MOCK) {
    return mockStudents();
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const users = await usersCollection.find().toArray();

  const u = users
    .map((user) => ({
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      attendanceList: user.attendanceList,
    }))
    .sort((a, b) => a.email - b.email);
  for (let i = 0; i < 10; i++) {
    console.log(i, u[i].email);
  }

  return u;
}
