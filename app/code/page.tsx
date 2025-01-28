import Header from "@/components/header";
import { userFromCookie } from "@/lib/cookies/userFromCookie";
import { generateCode } from "@/lib/generateCode";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function CodePage() {
  const cookieStore = await cookies();
  const user = await userFromCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  return (
    <>
      <Header role={user.role} />
      <div className="flex justify-center">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <h2 className="text-2xl font-bold text-center">Today&apos;s Code</h2>
          <div className="flex flex-col items-center space-y-6">
            <div className="text-5xl font-bold tracking-wider bg-gray-200 p-4 rounded-lg">
              {generateCode()}
            </div>
            <p className="text-center text-gray-600">
              Use this code to confirm your attendance
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
