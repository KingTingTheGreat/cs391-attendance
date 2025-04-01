import { Class, UserProps } from "@/types";
import { Redis } from "@upstash/redis";
import { parseUser } from "./parseUser";
import { ENV } from "../env";

const redis = Redis.fromEnv();

export async function getUserFromCache(id: string): Promise<UserProps | null> {
  const result = await redis.get(`${id}-${ENV}`);
  return parseUser(result as UserProps);
}

export async function setUserInCache(user: UserProps) {
  await redis.set(`${user.email}-${ENV}`, user);
}

export async function setInCache(
  key: string,
  value: string,
  expireIn?: number,
) {
  const opts = expireIn !== undefined ? { ex: expireIn } : {};
  await redis.set(`${key}-${ENV}`, value, opts);
}

export async function getFromCache(key: string): Promise<string | null> {
  return await redis.get(`${key}-${ENV}`);
}

export async function deleteFromCache(id: string) {
  await redis.del(`${id}-${ENV}`);
}

export async function clearCache() {
  let cursor = 0;
  const match = `*@bu.edu-${ENV}`;

  while (true) {
    const [newCursor, keys] = await redis.scan(cursor, { match });
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    cursor = parseInt(newCursor);
    if (cursor === 0) {
      break;
    }
  }
}

const datesKey = `-dates-${ENV}`;

export async function setDateCache(classType: Class, ...dates: string[]) {
  await redis.sadd(classType + datesKey, dates);
}

export async function addDateToCache(classType: Class, date: string) {
  await redis.sadd(classType + datesKey, date);
}

// handle removal by updating entire set when viewed by course staff
