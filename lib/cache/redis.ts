import { UserProps } from "@/types";
import { Redis } from "@upstash/redis";
import { parseUser } from "./parseUser";

const redis = Redis.fromEnv();

export async function getFromCache(email: string): Promise<UserProps | null> {
  const result = await redis.get(email);
  return parseUser(result as UserProps);
}

export async function setToCache(user: UserProps) {
  // expiry in 60 seconds * 5 = 5 minutes
  await redis.set(user.email, user, { ex: 60 * 5 });
}

export async function deleteFromCache(email: string) {
  await redis.del(email);
}

export async function clearCache() {
  await redis.flushall();
}
