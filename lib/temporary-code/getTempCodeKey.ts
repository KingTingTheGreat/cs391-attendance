import { createHash } from "crypto";
import { formatDate } from "../util/format";
import { Class } from "@/types";

const TOKEN_KEY_LENGTH = 16;

export const SCAN_KEY_CONSTANT = "scan-temporary-code-key";
export const INPUT_KEY_CONSTANT = "input-temporary-code-key";

export function getScanTempCodeKey(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret) throw new Error("todayCode() must be called on the server");
  return createHash("sha256")
    .update(secret + formatDate(new Date()) + classType + SCAN_KEY_CONSTANT)
    .digest("base64url")
    .slice(0, TOKEN_KEY_LENGTH)
    .toUpperCase();
}

export function getInputTempCodeKey(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret) throw new Error("todayCode() must be called on the server");
  return createHash("sha256")
    .update(secret + formatDate(new Date()) + classType + INPUT_KEY_CONSTANT)
    .digest("base64url")
    .slice(0, TOKEN_KEY_LENGTH)
    .toUpperCase();
}
