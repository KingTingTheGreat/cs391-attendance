import CodeDisplay from "@/components/code-display";
import Header from "@/components/header";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { generateCode } from "@/lib/generateCode";
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

  console.log("code viewed by", user.name, user.email);

  return (
    <>
      <Header role={user.role} />
      <div className="flex justify-center">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <h2 className="text-2xl font-bold text-center">Today&apos;s Code</h2>
          <div className="flex flex-col items-center space-y-6">
            <CodeDisplay code={generateCode()} />
            <p className="text-center text-gray-600">
              Use this code to confirm your attendance
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
