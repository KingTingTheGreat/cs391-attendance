import { Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
export const NUM_CODES = (() => {
  const numCodes = Number(process.env.NUM_CODES);
  if (isNaN(numCodes) || numCodes < 0) {
    // default to 3
    return 3;
  }
  return numCodes;
})();
// acceptable window in both direction (before and after)
// in milliseconds
export const GRACE_PERIOD = (() => {
  const gracePeriod = Number(process.env.GRACE_PERIOD);
  if (isNaN(gracePeriod) || gracePeriod < 0) {
    // default to 0 ms
    return 0;
  }
  return gracePeriod;
})();
// temporary code ttl in seconds
export const TTL = (() => {
  const ttl = Number(process.env.TTL);
  if (isNaN(ttl) || ttl < 0) {
    // default to 10 seconds
    return 10 * 1000;
  }
  return ttl * 1000;
})();
// how often the temporary code display refreshes in milliseconds
export const INTERVAL_LENGTH = (() => {
  const ttl = Number(process.env.INTERVAL_LENGTH);
  if (isNaN(ttl) || ttl < 0) {
    // default to 250 milliseconds
    return 250;
  }
  return ttl;
})();
