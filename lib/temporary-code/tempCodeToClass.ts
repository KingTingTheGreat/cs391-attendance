import { Class } from "@/types";
import { createInputTotp, createScanTotp } from "./createTotpObj";

const WINDOW_SIZE = 1;

export default function tempCodeToClass(code: string): Class | null {
  for (const classType in Object.keys(Class)) {
    const scanTOTP = createScanTotp(classType as Class);
    if (scanTOTP.validate({ token: code, window: WINDOW_SIZE }) !== null) {
      return classType as Class;
    }

    const inputTOTP = createInputTotp(classType as Class);
    if (inputTOTP.validate({ token: code, window: WINDOW_SIZE }) !== null) {
      return classType as Class;
    }
  }

  return null;
}
