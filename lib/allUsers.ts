"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { AttendanceProps, Role, UserProps } from "@/types";
import { mockStudents } from "./mockStudents";

export async function allUsers(): Promise<UserProps[]> {
  if (process.env.ENVIRONMENT === "dev") {
    return mockStudents();
  }
  // const usersCollection = await getCollection(USERS_COLLECTION);
  //
  // const users = await usersCollection.find().toArray();

  const x = mockStudents();
  // x.push(
  //   ...users.map((user) => ({
  //     name: user.name as string,
  //     email: user.email as string,
  //     picture: user.picture as string,
  //     role: user.role as Role,
  //     attendanceList: user.attendanceList as AttendanceProps[],
  //   })),
  // );

  return x;
}
