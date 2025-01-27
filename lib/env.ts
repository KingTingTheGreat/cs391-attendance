import { Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
export const DISABLE_DAY_CHECKING = process.env.DISABLE_DAY_CHECKING === "true";

// CDS default coords
export const CLASS_COORDS = {
  latitude: Number(process.env.CLASS_LATITUDE || 42.350071539724084),
  longitude: Number(process.env.CLASS_LONGITUDE || -71.10330520184607),
};
// 500 meter default
export const MAX_ALLOWED_DISTANCE = Number(
  process.env.MAX_ALLOWED_DISTANCE || 500,
);
console.log("class coords", CLASS_COORDS);
console.log("max allowed distance", MAX_ALLOWED_DISTANCE);
