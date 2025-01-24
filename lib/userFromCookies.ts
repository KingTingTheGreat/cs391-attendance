"use server";
import { UserProps, Role } from "@/types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default async function userFromCookies(
  cookieStore: ReadonlyRequestCookies,
): Promise<UserProps | null> {
  console.log(cookieStore);
  return {
    name: "cs391 student name",
    email: "cs391@bu.edu",
    role: Role.Student,
  };
}
