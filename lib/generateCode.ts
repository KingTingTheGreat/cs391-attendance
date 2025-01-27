import { createHash } from "crypto";
import { formatDate } from "./util/format";

export function generateCode() {
  const secret = process.env.SECRET as string;
  return createHash("sha256")
    .update(formatDate(new Date()) + secret)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}
