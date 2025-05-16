import TodayCodeDisplay from "@/components/control/TodayCodeDisplay";
import Header from "@/components/Header";
import QueryWrapper from "@/components/QueryWrapper";
import { dbDataFromAuthCookie } from "@/lib/cookies/dbDataFromAuthCookie";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function CodePage() {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  console.log("code viewed by", dbData.user.name, dbData.user.email);

  return (
    <>
      <Header role={dbData.user.role} />
      <div className="flex justify-center">
        <QueryWrapper>
          <TodayCodeDisplay />
        </QueryWrapper>
      </div>
    </>
  );
}
