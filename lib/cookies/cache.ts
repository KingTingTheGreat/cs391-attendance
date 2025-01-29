import { UserProps } from "@/types";
import { NextResponse } from "next/server";
import { CACHE_COOKIE } from "./cookies";
import { CacheClaims, createJwt, verifyJwt } from "../jwt";
import { ENV } from "../env";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export function setCacheCookie(
  user: UserProps,
  response: NextResponse,
): boolean {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  response.cookies.set(
    CACHE_COOKIE,
    createJwt({
      user,
      expiration: now, // 15 mins from now
    }),
    {
      httpOnly: true,
      secure: ENV === "prod",
      path: "/",
    },
  );
  return true;
}

export function userFromCacheCookie(
  cookieStore: ReadonlyRequestCookies | RequestCookies,
): UserProps | null {
  const jwt = cookieStore.get(CACHE_COOKIE)?.value;
  if (!jwt) return null;

  const res = verifyJwt(jwt);
  if (!res.verified || !res.claims) return null;
  if (
    res.claims.expiration === undefined ||
    new Date(res.claims.expiration).getTime() < new Date().getTime()
  ) {
    return null;
  }

  const claims = res.claims as CacheClaims;
  if (!claims) {
    return null;
  }
  const user = claims.user;
  if (!user) {
    return null;
  }

  return {
    ...user,
    attendanceList: user.attendanceList
      ? user.attendanceList.map((att) => ({
          date: new Date(att.date),
          class: att.class,
        }))
      : [],
  };
}
