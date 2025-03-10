import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { PREV_EXP_SEC_COOKIE } from "./cookies";

export function prevExpSecFromCookie(
  cookieStore: ReadonlyRequestCookies | RequestCookies,
): number | undefined {
  const prev = Number(cookieStore.get(PREV_EXP_SEC_COOKIE)?.value);
  if (isNaN(prev) || prev <= 0) return undefined;

  return prev;
}
