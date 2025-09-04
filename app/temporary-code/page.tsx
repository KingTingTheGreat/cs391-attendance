import TemporaryCodeDisplay from "@/components/control/TemporaryCodeDisplay";
import Header from "@/components/Header";
import { dbDataFromAuthCookie } from "@/lib/cookies/dbDataFromAuthCookie";
import {
  getInputTempCodeKey,
  getScanTempCodeKey,
} from "@/lib/code/getTempCodeKey";
import { Class, Role, TempCodeKeys } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function TempCodePage() {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore, false, true);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return redirect("/");
  }

  const scanTempCodeKeys: TempCodeKeys = {};
  const inputTempCodeKeys: TempCodeKeys = {};
  Object.keys(Class).map((classType) => {
    scanTempCodeKeys[classType] = getScanTempCodeKey(
      classType as Class,
      dbData.user.email,
    );
    inputTempCodeKeys[classType] = getInputTempCodeKey(
      classType as Class,
      dbData.user.email,
    );
  });

  console.log("temporary code viewed by", dbData.user.name, dbData.user.email);

  return (
    <>
      <Header role={dbData.user.role} />
      <div className="flex flex-col items-center">
        <TemporaryCodeDisplay
          scanTempCodeKeys={scanTempCodeKeys}
          inputTempCodeKeys={inputTempCodeKeys}
        />
      </div>
    </>
  );
}
