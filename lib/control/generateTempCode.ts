"use server";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { ENV, MOCK } from "../env";
import { setInCache } from "../cache/redis";
import { newTemporaryCode } from "../generateCode";

const allowedRoles = [Role.staff, Role.admin];

export async function generateTempCode(
  seconds: number,
): Promise<string | null> {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  if (ENV === "dev" && MOCK) {
    return "mockcode";
  }

  const tempCode = newTemporaryCode();

  setInCache(tempCode, tempCode, seconds);

  return tempCode;
}
