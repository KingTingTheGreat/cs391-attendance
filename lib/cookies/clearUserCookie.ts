import { NextResponse } from "next/server";
import { AUTH_COOKIE, CACHE_COOKIE } from "./cookies";

export async function clearUserCookie(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(CACHE_COOKIE);
}
