import { createHash } from "crypto";
import { formatDate } from "../util/format";
import { Class } from "@/types";
import { base32Encode } from "../b32";

export const INPUT_KEY_CONSTANT = "input-temporary-code-key";

export function getInputTempCodeKey(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret)
    throw new Error("getInputTempCodeKey() must be called on the server");
  console.log("returning input temp code key");
  return base32Encode(
    createHash("sha256")
      .update(secret + formatDate(new Date()) + classType + INPUT_KEY_CONSTANT)
      .digest(),
  );
}

export const SCAN_KEY_CONSTANT = "scan-temporary-code-key";

export function getScanTempCodeKey(classType: Class) {
  const secret = process.env.SECRET as string;
  if (!secret)
    throw new Error("getScanTempCodeKey() must be called on the server");
  return base32Encode(
    createHash("sha256")
      .update(secret + formatDate(new Date()) + classType + SCAN_KEY_CONSTANT)
      .digest(),
  );
}
