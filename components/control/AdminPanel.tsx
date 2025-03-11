"use client";
import { Role, UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./EditRole";
import DeleteAllStudents from "./DeleteAllStudents";
import DeleteUser from "./DeleteUser";
import { UsersContextProvider } from "./UsersContext";
import MarkStudentAttendance from "./MarkStudentAttendance";
import AttendanceSheet from "../attendance/AttendanceSheet";
import { CircularProgress } from "@mui/material";
import { getAllUsers } from "@/lib/util/allUsers";

export default function AdminPanel({ role }: { role: Role }) {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    getAllUsers().then((data) => setUsers(data));
  }, []);

  if (users === null)
    return (
      <div className="flex justify-center items-center w-full p-20">
        <CircularProgress color="primary" size={100} />
      </div>
    );

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
        <AttendanceSheet />
      </div>
      {role === Role.admin && (
        <div className="flex justify-center">
          <DeleteAllStudents />
        </div>
      )}
    </UsersContextProvider>
  );
}
