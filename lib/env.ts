import { Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
export const NO_REDIS = process.env.NEXT_PUBLIC_NO_REDIS === "true";
export const NUM_CODES = (() => {
  const numCodes = Number(process.env.NUM_CODES);
  if (isNaN(numCodes) || numCodes < 0) {
    // default to 3
    return 3;
  }
  return numCodes;
})();
export const GRACE_PERIOD = (() => {
  const gracePeriod = Number(process.env.GRACE_PERIOD);
  if (isNaN(gracePeriod) || gracePeriod < 0) {
    // default to 0 ms
    return 0;
  }
  return gracePeriod;
})();
