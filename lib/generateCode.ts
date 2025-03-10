import { createHash } from "crypto";
import { formatDate } from "./util/format";

export const CODE_LENGTH = 8;

export function todayCode() {
  const secret = process.env.SECRET as string;
  return createHash("sha256")
    .update(formatDate(new Date()) + secret)
    .digest("hex")
    .slice(0, CODE_LENGTH)
    .toUpperCase();
}

export function newTemporaryCode() {
  const secret = process.env.SECRET as string;
  return createHash("sha256")
    .update(new Date() + secret)
    .digest("hex")
    .slice(0, CODE_LENGTH)
    .toUpperCase();
}
