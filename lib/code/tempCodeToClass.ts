import { Class } from "@/types";
import { createInputTotp, createScanTotp } from "./createTotpObj";
import { WINDOW_SIZE } from "../env";
import { base32CodeToDigits } from "../b32";

export default function tempCodeToClass(
  code: string,
  emails: string[],
  onlyScan?: boolean,
): { classType: Class; email: string } | null {
  const digits = base32CodeToDigits(code);

  for (const classType of Object.keys(Class)) {
    for (const email of emails) {
      const scanTOTP = createScanTotp(classType as Class, undefined, email);
      if (scanTOTP.validate({ token: code, window: WINDOW_SIZE }) !== null) {
        return { classType: classType as Class, email };
      }
      if (onlyScan || digits === null) {
        continue;
      }

      const inputTOTP = createInputTotp(classType as Class, undefined, email);
      if (inputTOTP.validate({ token: digits, window: WINDOW_SIZE }) !== null) {
        return { classType: classType as Class, email };
      }
    }
  }

  return null;
}
