import AdminPanel from "@/components/control/AdminPanel";
import Header from "@/components/Header";
import {
  PREV_ATTENDANCE_SORT_COOKIE,
  PREV_CLASS_TYPE_COOKIE,
} from "@/lib/cookies/cookies";
import { dbDataFromAuthCookie } from "@/lib/cookies/dbDataFromAuthCookie";
import { Class, Role } from "@/types";
import { CircularProgress } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const allowedRoles = [Role.staff, Role.admin];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return redirect("/");
  }

  const prevClassType = cookieStore.get(PREV_CLASS_TYPE_COOKIE)?.value as Class;
  const prevSortModel = JSON.parse(
    cookieStore.get(PREV_ATTENDANCE_SORT_COOKIE)?.value || "[]",
  ) as GridSortModel;

  console.log("prevClassType", prevClassType);
  console.log("prevSortModel", prevSortModel);

  console.log("admin panel viewed by", dbData.user.name, dbData.user.email);

  // use default role in dev environment
  return (
    <>
      <Header role={dbData.user.role} />
      <div className="px-8 py-2 w-full">
        <h1 className="text-4xl font-bold text-center">Admin Page</h1>
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full p-20">
              <CircularProgress color="primary" size={100} />
            </div>
          }
        >
          <AdminPanel role={dbData.user.role} />
        </Suspense>
      </div>
    </>
  );
}
