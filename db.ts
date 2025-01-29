import { Collection, Db, MongoClient } from "mongodb";
import { ENV } from "./lib/env";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is undefined");
}

const DB_NAME = "cs391-attendance-" + ENV || "dev";
export const USERS_COLLECTION = "users-collection";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export default async function getCollection(
  collectionName: string,
): Promise<Collection> {
  if (!db) {
    db = await connect();
  }

  return db.collection(collectionName);
}

export async function startCollectionSession(collectionName: string) {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }

  const session = client.startSession();
  const collection = client.db(DB_NAME).collection(collectionName);

  return { session, collection };
}
