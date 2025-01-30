import { UserProps } from "@/types";
import { Redis } from "@upstash/redis";
import { parseUser } from "./parseUser";
import { ENV } from "../env";

const redis = Redis.fromEnv();

export async function getFromCache(email: string): Promise<UserProps | null> {
  const result = await redis.get(`${email}-${ENV}`);
  return parseUser(result as UserProps);
}

export async function setToCache(user: UserProps) {
  await redis.set(`${user.email}-${ENV}`, user);
}

export async function deleteFromCache(email: string) {
  await redis.del(`${email}-${ENV}`);
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
