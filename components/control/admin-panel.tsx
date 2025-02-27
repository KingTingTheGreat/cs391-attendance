"use client";
import { allUsers } from "@/lib/util/allUsers";
import { Role, UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./edit-role";
import DeleteAllStudents from "./delete-all-students";
import DeleteUser from "./delete-user";
import { UsersContextProvider } from "./users-context";
import MarkStudentAttendance from "./mark-student-attendance";
import Loading from "../loading";
import MuiAttendanceSheet from "../attendance/mui-attendance-sheet";

export default function AdminPanel({ role }: { role: Role }) {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    allUsers().then((data) => setUsers(data));
  }, []);

  if (users === null) return <Loading />;

  return (
    <UsersContextProvider usersInput={users}>
      <div className="flex flex-col items-center sm:flex-row justify-center sm:items-start">
        {role === Role.admin && (
          <>
            <EditRole />
            <DeleteUser />
          </>
        )}
        <MarkStudentAttendance />
      </div>

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
