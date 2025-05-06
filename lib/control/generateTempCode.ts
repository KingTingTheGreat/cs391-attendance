"use server";
import { Class, Role } from "@/types";
import { cookies } from "next/headers";
import { ENV, MOCK } from "../env";
import { setInCache } from "../cache/redis";
import { newTemporaryCode } from "../generateCode";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function generateTempCode(
  seconds: number,
  classType: Class,
): Promise<string | null> {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return null;
  }

  if (ENV === "dev" && MOCK) {
    return "mockcode";
  }

  const tempCode = newTemporaryCode(classType);

  setInCache(tempCode, classType, seconds);

  return tempCode;
}
