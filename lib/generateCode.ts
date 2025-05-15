import { createHash } from "crypto";
import { formatDate } from "./util/format";
import { Class } from "@/types";
import { INPUT_CODE_LENGTH } from "./env";

export function todayCode(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret) throw new Error("todayCode() must be called on the server");
  return createHash("sha256")
    .update(formatDate(new Date()) + secret + classType)
    .digest("hex")
    .slice(0, INPUT_CODE_LENGTH)
    .toUpperCase();
}
