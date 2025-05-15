import { TOTP } from "otpauth";
import { getInputTempCodeKey, getScanTempCodeKey } from "./getTempCodeKey";
import { Class } from "@/types";
import {
  INPUT_TEMP_CODE_NUM_DIGITS,
  INPUT_TEMP_CODE_PERIOD,
  SCAN_TEMP_CODE_LENGTH,
  SCAN_TEMP_CODE_PERIOD,
} from "../env";

export function createInputTotp(classType: Class, secret?: string) {
  return new TOTP({
    secret: secret || getInputTempCodeKey(classType),
    digits: INPUT_TEMP_CODE_NUM_DIGITS,
    period: INPUT_TEMP_CODE_PERIOD,
  });
}

export function createScanTotp(classType: Class, secret?: string) {
  return new TOTP({
    secret: secret || getScanTempCodeKey(classType),
    digits: SCAN_TEMP_CODE_LENGTH,
    period: SCAN_TEMP_CODE_PERIOD,
  });
}
