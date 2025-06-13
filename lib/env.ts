import { Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const WINDOW_SIZE = (() => {
  const winSize = Number(process.env.WINDOW_SIZE);
  if (isNaN(winSize) || winSize < 0) {
    return 1;
  }
  return winSize;
})();

export const INPUT_CODE_LENGTH = (() => {
  const inputCodeLength = Number(process.env.NEXT_PUBLIC_INPUT_CODE_LENGTH);
  if (isNaN(inputCodeLength) || inputCodeLength < 0) {
    return 6;
  }
  return inputCodeLength;
})();
export const INPUT_TEMP_CODE_NUM_DIGITS = Math.floor(
  INPUT_CODE_LENGTH * (Math.log(32) / Math.log(10)),
);
export const INPUT_TEMP_CODE_PERIOD = (() => {
  const inputTempCodePeriod = Number(
    process.env.NEXT_PUBLIC_INPUT_TEMP_CODE_PERIOD,
  );
  if (isNaN(inputTempCodePeriod) || inputTempCodePeriod < 0) {
    return 15;
  }
  return inputTempCodePeriod;
})();

export const SCAN_TEMP_CODE_LENGTH = (() => {
  const scanTempCodeLength = Number(
    process.env.NEXT_PUBLIC_SCAN_TEMP_CODE_LENGTH,
  );
  if (isNaN(scanTempCodeLength) || scanTempCodeLength < 0) {
    return 10;
  }
  return scanTempCodeLength;
})();
export const SCAN_TEMP_CODE_PERIOD = (() => {
  const scanTempCodePeriod = Number(
    process.env.NEXT_PUBLIC_SCAN_TEMP_CODE_PERIOD,
  );
  if (isNaN(scanTempCodePeriod) || scanTempCodePeriod < 0) {
    return 5;
  }
  return scanTempCodePeriod;
})();

// mock dev environment variables
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
