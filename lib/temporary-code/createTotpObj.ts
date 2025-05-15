import { TOTP } from "otpauth";
import { getInputTempCodeKey, getScanTempCodeKey } from "./getTempCodeKey";
import { Class } from "@/types";

const SCAN_TEMP_CODE_LENGTH = 12;
const SCAN_TEMP_CODE_PERIOD = 5;
export function createScanTotp(classType: Class) {
  return new TOTP({
    secret: getScanTempCodeKey(classType),
    digits: SCAN_TEMP_CODE_LENGTH,
    period: SCAN_TEMP_CODE_PERIOD,
  });
}
const INPUT_TEMP_CODE_LENGTH = 6;
const INPUT_TEMP_CODE_PERIOD = 5;

export function createInputTotp(classType: Class) {
  return new TOTP({
    secret: getInputTempCodeKey(classType),
    digits: INPUT_TEMP_CODE_LENGTH,
    period: INPUT_TEMP_CODE_PERIOD,
  });
}
