import { UserProps } from "@/types";
import { Redis } from "@upstash/redis";
import { parseUser } from "./parseUser";

const redis = Redis.fromEnv();

export async function getFromCache(email: string): Promise<UserProps | null> {
  const result = await redis.get(email);
  return parseUser(result as UserProps);
}

export async function setToCache(user: UserProps) {
  await redis.set(user.email, user);
}
