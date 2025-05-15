import { Class } from "@/types";
import { createInputTotp, createScanTotp } from "./createTotpObj";
import { WINDOW_SIZE } from "../env";
import { base32CodeToDigits } from "../b32";

export default function tempCodeToClass(
  code: string,
  onlyScan?: boolean,
): Class | null {
  const digits = base32CodeToDigits(code);

  for (const classType of Object.keys(Class)) {
    const scanTOTP = createScanTotp(classType as Class);
    if (scanTOTP.validate({ token: code, window: WINDOW_SIZE }) !== null) {
      return classType as Class;
    }
    if (onlyScan || digits === null) {
      continue;
    }

    const inputTOTP = createInputTotp(classType as Class);
    if (inputTOTP.validate({ token: digits, window: WINDOW_SIZE }) !== null) {
      return classType as Class;
    }
  }

  return null;
}
