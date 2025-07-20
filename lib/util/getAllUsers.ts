"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Role, UserProps } from "@/types";
import { mockStudents } from "../mockStudents";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ENV, MOCK } from "../env";
import documentToUserProps from "./documentToUserProps";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function getAllUsers(): Promise<UserProps[]> {
  const cookieStore = await cookies();
  const authData = await dbDataFromAuthCookie(cookieStore, false, true);
  if (!authData) {
    return redirect("/");
  }

  const { user } = authData;
  if (!allowedRoles.includes(user.role)) {
    // only allow staff and admin to access this data
    return redirect("/");
  }

  if (ENV === "dev" && MOCK) {
    return mockStudents();
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const users = await usersCollection.find().toArray();

  return users.map((user) => documentToUserProps(user));
}
