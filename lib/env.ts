import { Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
