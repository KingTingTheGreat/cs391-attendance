import Header from "@/components/Header";
import PasswordPanel from "@/components/password/PasswordPanel";
import { jwtDataFromAuthCookie } from "@/lib/cookies/jwtDataFromAuthCookie";
import { ENABLE_PASSWORD } from "@/lib/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PasswordPage() {
  const cookieStore = await cookies();
  const claims = await jwtDataFromAuthCookie(cookieStore);
  if (!claims || !ENABLE_PASSWORD) {
    return redirect("/");
  }

  console.log("password page viewed by", claims.name, claims.email);

  return (
    <>
      <Header />
      <div className="px-8 py-2 w-full">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <h1 className="text-2xl font-bold text-center">Configure Password</h1>
          <PasswordPanel />
        </div>
      </div>
    </>
  );
}
