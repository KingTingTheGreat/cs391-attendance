import { DayEnum, Role } from "@/types";

export const ENV = process.env.ENVIRONMENT;
export const DEFAULT_ROLE = process.env.DEFAULT_ROLE as Role;
export const MOCK = process.env.MOCK === "true";
export const ENABLE_SIGN_ON = process.env.ENABLE_SIGN_ON === "true";
export const DISABLE_DAY_CHECKING = process.env.DISABLE_DAY_CHECKING === "true";

// assume lecture days are different than discussion/lab days
export const LECTURE_DAYS = [DayEnum.tuesday, DayEnum.thursday];
export const DISCUSSION_DAYS = [DayEnum.friday];
export const CLASS_DAYS = [...LECTURE_DAYS, ...DISCUSSION_DAYS];
