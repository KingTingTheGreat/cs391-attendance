import { createHash } from "crypto";
import { formatDate } from "./util/format";
import { Class } from "@/types";

export const CODE_LENGTH = 6;

export function todayCode(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret) throw new Error("todayCode() must be called on the server");
  return createHash("sha256")
    .update(formatDate(new Date()) + secret + classType)
    .digest("hex")
    .slice(0, CODE_LENGTH)
    .toUpperCase();
}

export function newTemporaryCode(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret)
    throw new Error("newTemporaryCode() must be called on the server");
  return createHash("sha256")
    .update(Date.now() + secret + classType)
    .digest("hex")
    .slice(0, CODE_LENGTH)
    .toUpperCase();
}
