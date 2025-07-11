import { createHash } from "crypto";
import { formatDate } from "../util/format";
import { Class } from "@/types";
import { base32EncodeBuffer } from "../b32";

const INPUT_KEY_CONSTANT = "input-temporary-code-key";

export function getInputTempCodeKey(classType: Class, email: string) {
  const secret = process.env.SECRET as string;
  if (!secret)
    throw new Error("getInputTempCodeKey() must be called on the server");
  console.log("returning input temp code key");
  return base32EncodeBuffer(
    createHash("sha256")
      .update(
        secret +
          formatDate(new Date()) +
          classType +
          INPUT_KEY_CONSTANT +
          email,
      )
      .digest(),
  );
}

const SCAN_KEY_CONSTANT = "scan-temporary-code-key";

export function getScanTempCodeKey(classType: Class, email: string) {
  const secret = process.env.SECRET as string;
  if (!secret)
    throw new Error("getScanTempCodeKey() must be called on the server");
  return base32EncodeBuffer(
    createHash("sha256")
      .update(
        secret + formatDate(new Date()) + classType + SCAN_KEY_CONSTANT + email,
      )
      .digest(),
  );
}
