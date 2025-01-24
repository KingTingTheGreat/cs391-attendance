import { setUserCookies } from "@/lib/cookies";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.json(
      { error: "please try to sign in again" },
      { status: 400 },
    );
  }

  const res = NextResponse.redirect(req.nextUrl.origin, {
    status: 303,
  });
  const success = await setUserCookies(code, res);
  if (!success) {
    return NextResponse.json(
      { error: "please try to sign in again" },
      { status: 400 },
    );
  }

  return res;
}
