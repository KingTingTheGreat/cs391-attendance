import AdminPanel from "@/components/control/admin-panel";
import Header from "@/components/header";
import { userFromCookies } from "@/lib/cookies";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  // use default role in dev environment
  return (
    <>
      <Header role={user.role} />
      <div className="px-8 py-2 w-full">
        <h1 className="text-4xl font-bold text-center">Admin Page</h1>
        <AdminPanel role={user.role} />
      </div>
    </>
  );
}
