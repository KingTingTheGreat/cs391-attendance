"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { UserProps } from "@/types";

export async function allUsers(): Promise<UserProps[]> {
  console.log("retrieving all users");
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
