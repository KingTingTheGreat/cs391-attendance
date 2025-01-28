"use server";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "./cookies";
import { ENV } from "../env";

export async function clearUserCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: ENV === "prod",
    path: "/",
  });

  return true;
}
