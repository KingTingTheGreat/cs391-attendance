import { TOTP } from "otpauth";
import { getInputTempCodeKey, getScanTempCodeKey } from "./getTempCodeKey";
import { Class } from "@/types";

const INPUT_TEMP_CODE_LENGTH = 6;
export const INPUT_TEMP_CODE_PERIOD = 15;

export function createInputTotp(classType: Class, secret?: string) {
  return new TOTP({
    secret: secret || getInputTempCodeKey(classType),
    digits: INPUT_TEMP_CODE_LENGTH,
    period: INPUT_TEMP_CODE_PERIOD,
  });
}

const SCAN_TEMP_CODE_LENGTH = 12;
export const SCAN_TEMP_CODE_PERIOD = 5;

export function createScanTotp(classType: Class, secret?: string) {
  return new TOTP({
    secret: secret || getScanTempCodeKey(classType),
    digits: SCAN_TEMP_CODE_LENGTH,
    period: SCAN_TEMP_CODE_PERIOD,
  });
}
