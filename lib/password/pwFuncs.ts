import { PwInfo } from "@/types";
import { randomBytes } from "crypto";
import argon2 from "argon2";

export function newSalt(): string {
  const bytes = randomBytes(16);
  return bytes.toString("base64");
}

export async function hashPassword(pw: string, salt: string): Promise<string> {
  return await argon2.hash(pw + salt);
}

export async function verifyPassword(
  pw: string,
  pwInfo: PwInfo,
): Promise<boolean> {
  return await argon2.verify(pwInfo.pwHash, pw + pwInfo.salt);
}
