import { Role } from "@/types";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { DEFAULT_ROLE, ENABLE_SIGN_ON, ENV, MOCK } from "../env";
import { AUTH_COOKIE } from "./cookies";
import { AuthClaims, verifyJwt } from "../jwt";

/**
 * returns the JWT user data if exists and not expired.
 * does not include role or attendanceList
 * use dbDataFromAuthCookie() to get role and attendanceList
 * otherwise, returns null
 */
export async function jwtDataFromAuthCookie(
  cookieStore: ReadonlyRequestCookies | RequestCookies,
): Promise<AuthClaims | null> {
  if (ENV === "dev" && MOCK && !ENABLE_SIGN_ON) {
    const role = DEFAULT_ROLE || Role.student;
    const name = "dev-" + role;
    return {
      name,
      email: name + "@bu.edu",
    };
  }

  const jwt = cookieStore.get(AUTH_COOKIE)?.value;
  if (!jwt) return null;

  const res = verifyJwt(jwt);
  if (!res.verified || !res.claims) return null;

  const claims = res.claims as AuthClaims;
  if (!claims) {
    return null;
  }

  return claims;
}
