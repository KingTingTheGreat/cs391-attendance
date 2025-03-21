import AdminPanel from "@/components/control/AdminPanel";
import Header from "@/components/Header";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  console.log("admin panel viewed by", user.name, user.email);

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
