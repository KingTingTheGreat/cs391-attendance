import { setUserAuthCookie } from "@/lib/cookies/setUserAuthCookie";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      req.nextUrl.origin +
        "/?message=" +
        encodeURIComponent(
          "something went wrong, perhaps you did not grant access. please sign in again.",
        ),
    );
  }

  const res = NextResponse.redirect(req.nextUrl.origin, {
    status: 303,
  });
  const success = await setUserAuthCookie(code, res);
  if (!success) {
    return NextResponse.redirect(
      req.nextUrl.origin +
        "/?message=" +
        encodeURIComponent(
          "something went wrong on our end. please sign in again and notify the instructor.",
        ),
    );
  }

  return res;
}
