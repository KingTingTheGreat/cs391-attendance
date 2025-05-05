import { Redis } from "@upstash/redis";
import { ENV } from "../env";

const redis = Redis.fromEnv();

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
