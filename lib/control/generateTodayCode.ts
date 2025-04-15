"use server";
import { Class, Role } from "@/types";
import { cookies } from "next/headers";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { ENV, MOCK } from "../env";
import { todayCode } from "../generateCode";

const allowedRoles = [Role.staff, Role.admin];

export async function generateTodayCode(
  classType: Class,
): Promise<string | null> {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  if (ENV === "dev" && MOCK) {
    return "mockcode";
  }

  const code = todayCode(classType);

  return code;
}
