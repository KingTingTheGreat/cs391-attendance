import TemporaryCodeDisplay from "@/components/control/temporary-code-display";
import Header from "@/components/header";
import QRCodeDisplay from "@/components/qrcode-display";
import { prevExpSecFromCookie } from "@/lib/cookies/prevExpSecFromCookie";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function TempCodePage() {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    return redirect("/");
  }

  console.log("temporary code viewed by", user.name, user.email);

  const prevExpSec = prevExpSecFromCookie(cookieStore);
  console.log("prevExpSec", prevExpSec);

  return (
    <>
      <Header role={user.role} />
      <div className="p-1 m-2 flex flex-col items-center">
        <div className="flex justify-center">
          <TemporaryCodeDisplay prevSeconds={prevExpSec} />
        </div>
        <QRCodeDisplay />
      </div>
    </>
  );
}
