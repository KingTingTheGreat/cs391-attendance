import { createHash } from "crypto";
import { formatDate } from "./util/format";

export function generateCode() {
  return createHash("sha256")
    .update((formatDate(new Date()) + process.env.SECRET) as string)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}
