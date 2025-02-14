import Header from "@/components/header";
import PasswordPanel from "@/components/password-panel";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PasswordPage() {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore, true);

  if (!user) {
    return redirect("/");
  }

  console.log("password page by", user.name, user.email);

  return (
    <>
      <Header role={user.role} />
      <div className="px-8 py-2 w-full">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <h1 className="text-4xl font-bold text-center">Configure Password</h1>
          <PasswordPanel />
        </div>
      </div>
    </>
  );
}
