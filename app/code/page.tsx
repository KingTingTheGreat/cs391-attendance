import TodayCodeDisplay from "@/components/control/TodayCodeDisplay";
import Header from "@/components/Header";
import { PREV_QRCODE_SIZE_COOKIE } from "@/lib/cookies/cookies";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function CodePage() {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  const prevSize = Number(cookieStore.get(PREV_QRCODE_SIZE_COOKIE)?.value);

  console.log("code viewed by", user.name, user.email);

  return (
    <>
      <Header role={user.role} />
      <div className="flex justify-center">
        <TodayCodeDisplay prevSize={prevSize} />
      </div>
    </>
  );
}
