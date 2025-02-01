import TemporaryCode from "@/components/control/temporary-code";
import Header from "@/components/header";
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

  return (
    <>
      <Header role={user.role} />
      <div className="flex justify-center">
        <TemporaryCode />
      </div>
    </>
  );
}
