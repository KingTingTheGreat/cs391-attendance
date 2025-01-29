"use server";
import { AttendanceProps, Role, UserProps } from "@/types";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { DEFAULT_ROLE, ENABLE_SIGN_ON, ENV, MOCK } from "../env";
import { COOKIE_NAME } from "./cookies";
import { verifyJwt } from "../jwt";
import getCollection, { USERS_COLLECTION } from "@/db";

export async function userFromCookie(
  cookieStore: ReadonlyRequestCookies | RequestCookies,
): Promise<UserProps | null> {
  if (ENV === "dev" && MOCK && !ENABLE_SIGN_ON) {
    const role = DEFAULT_ROLE || Role.student;
    const name = "dev-" + role;
    return {
      name,
      email: name + "@bu.edu",
      picture:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Boston_University_Terriers_logo.svg/150px-Boston_University_Terriers_logo.svg.png",
      role,
      attendanceList: [],
    };
  }

  const jwt = cookieStore.get(COOKIE_NAME)?.value;
  if (!jwt) return null;

  const res = verifyJwt(jwt);
  if (!res.verified || !res.claims) return null;
  if (
    res.claims.expiration === undefined ||
    new Date(res.claims.expiration).getTime() < new Date().getTime()
  ) {
    return null;
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const data = await usersCollection.findOne({ email: res.claims.email });
  if (!data) return null;

  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    role: data.role as Role,
    attendanceList: data.attendanceList as AttendanceProps[],
  };
}
