import { createHash } from "crypto";
import { formatDate } from "./util/format";

export function todayCode() {
  const secret = process.env.SECRET as string;
  return createHash("sha256")
    .update(formatDate(new Date()) + secret)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}

export function newTemporaryCode() {
  const secret = process.env.SECRET as string;
  return createHash("sha256")
    .update(new Date() + secret)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}
