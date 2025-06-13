"use server";
import { Class, Role } from "@/types";
import { cookies } from "next/headers";
import { ENV, MOCK } from "../env";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";
import { todayCode } from "../generateCode";

const allowedRoles = [Role.staff, Role.admin];

export async function generateTodayCode(
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

  const code = todayCode(classType, dbData.user.email);

  return code;
}
