"use client";
import { allUsers } from "@/lib/allUsers";
import { Role, UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./edit-role";
import Loading from "./loading";
import MuiAttendanceSheet from "./mui-attendance-sheet";
import DeleteAllStudents from "./delete-all-students";
import DeleteUser from "./delete-user";
import { UsersContextProvider } from "./users-context";

export default function AdminPanel({ role }: { role: Role }) {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    allUsers().then((data) => setUsers(data));
  }, []);

  if (users === null) return <Loading />;

  return (
    <UsersContextProvider usersInput={users}>
      {role === Role.admin && (
        <div className="flex justify-center">
          <EditRole />
          <DeleteUser />
        </div>
      )}
      <div className="flex flex-col items-center p-8">
        <MuiAttendanceSheet />
      </div>
      {role === Role.admin && (
        <div className="flex justify-center">
          <DeleteAllStudents />
        </div>
      )}
    </UsersContextProvider>
  );
}
