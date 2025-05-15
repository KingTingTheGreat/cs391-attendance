import getCollection, { CODES_COLLECTION } from "@/db";
import { GRACE_PERIOD } from "./env";
import { Class } from "@/types";

export default async function codeToClass(code: string) {
  const now = Date.now();

  const codesCollection = await getCollection(CODES_COLLECTION);
  const data = await codesCollection.findOne({ code: code.toUpperCase() });
  // code not found
  if (!data) {
    console.error("code not found", code);
    return null;
  }

  // code not yet active
  if (now < data.start - GRACE_PERIOD) {
    console.log("code not yet active", code, now, data.start);
    return null;
  }
  // code expired
  if (now > data.end + GRACE_PERIOD) {
    console.log("code expired", code);
    return null;
  }

  return data.classType as Class;
}
