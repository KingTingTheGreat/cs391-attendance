"use server";
import { Class, Role, TemporaryCode } from "@/types";
import { cookies } from "next/headers";
import { ENV, MOCK, NUM_CODES } from "../env";
import { newTemporaryCode } from "../generateCode";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";
import getCollection, { CODES_COLLECTION } from "@/db";

const allowedRoles = [Role.staff, Role.admin];

export async function generateTempCodes(
  ttl: number,
  classType: Class,
  firstStart?: number,
): Promise<TemporaryCode[] | null> {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return null;
  }

  if (ENV === "dev" && MOCK) {
    const tempCodes = [];
    let start = firstStart || Date.now();

    for (let i = 0; i < NUM_CODES; i++) {
      const tempCode: TemporaryCode = {
        code: `mockcode${i}`,
        classType,
        start,
        end: start + ttl,
      };
      tempCodes.push(tempCode);

      start = tempCode.end;
    }

    return tempCodes;
  }

  const codesCollection = await getCollection(CODES_COLLECTION);

  const dbPromises = [];
  const tempCodes = [];
  let start = firstStart || Date.now();
  for (let i = 0; i < NUM_CODES; i++) {
    const code = newTemporaryCode(classType, i);

    const tempCode: TemporaryCode = {
      code,
      classType,
      start,
      end: start + ttl,
    };
    tempCodes.push(tempCode);

    dbPromises.push(codesCollection.insertOne({ ...tempCode }));

    console.log("creating new code", code);

    start = tempCode.end;
  }
  await Promise.all(dbPromises);

  // console.log("returning temp codes", tempCodes);
  return tempCodes;
}
