"use server";
import { Class, Role } from "@/types";
import { cookies } from "next/headers";
import { ENV, MOCK } from "../env";
import { todayCode } from "../generateCode";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

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

  const code = todayCode(classType);

  return code;
}
