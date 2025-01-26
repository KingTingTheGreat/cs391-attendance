import AdminPanel from "@/components/admin-panel";
import { userFromCookies } from "@/lib/cookies";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  // const cookieStore = await cookies();
  // const user = await userFromCookies(cookieStore);
  //
  // if (!user || user.role !== Role.admin) {
  //   return redirect("/");
  // }

  return (
    <div>
      <h1 className="text-4xl font-bold">Admin Page</h1>
      <AdminPanel />
    </div>
  );
}
