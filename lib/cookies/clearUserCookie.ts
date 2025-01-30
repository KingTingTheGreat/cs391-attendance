import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./cookies";

export async function clearUserCookie(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE);
}
