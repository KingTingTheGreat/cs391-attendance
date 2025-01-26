"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { UserProps } from "@/types";
import { mockStudents } from "./mockStudents";

export async function allUsers(): Promise<UserProps[]> {
  if (process.env.ENVIRONMENT === "dev") {
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
