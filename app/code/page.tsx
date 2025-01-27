import { userFromCookies } from "@/lib/cookies";
import { ENV } from "@/lib/env";
import { generateCode } from "@/lib/generateCode";
import { Role, UserProps } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function CodePage() {
  let user: UserProps | null = null;
  const role = process.env.DEFAULT as Role;

  if (ENV !== "dev" || role === undefined) {
    const cookieStore = await cookies();
    user = await userFromCookies(cookieStore);

    if (!user || !allowedRoles.includes(user.role)) {
      // only allow staff and admin to see this page
      return redirect("/");
    }
  } else if (!allowedRoles.includes(role)) {
    return redirect("/");
  }

  return (
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
  );
}
