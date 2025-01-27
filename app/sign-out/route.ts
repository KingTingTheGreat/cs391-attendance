import { clearUserCookie } from "@/lib/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(req.nextUrl.origin, {
    status: 303,
  });
  await clearUserCookie(res, await cookies());
  return res;
}
