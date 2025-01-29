import { NextResponse } from "next/server";
import { AUTH_COOKIE, CACHE_COOKIE } from "./cookies";
import { ENV } from "../env";

export async function clearUserCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: ENV === "prod",
    path: "/",
  });
  response.cookies.set(CACHE_COOKIE, "", {
    httpOnly: true,
    secure: ENV === "prod",
    path: "/",
  });

  return true;
}
