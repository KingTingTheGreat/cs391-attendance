"use client";
import { allUsers } from "@/lib/allUsers";
import { deleteAllStudents } from "@/lib/control/deleteAllStudents";
import { Role, UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./edit-role";
import Loading from "./loading";
import MuiAttendanceSheet from "./mui-attendance-sheet";

export default function AdminPanel({ role }: { role: Role }) {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    allUsers().then((data) => setUsers(data));
  }, []);

  if (users === null) return <Loading />;

  return (
    <>
      {role === Role.admin && <EditRole users={users} />}
      <div className="flex flex-col items-center p-8">
        <MuiAttendanceSheet users={users} />
      </div>
      {role === Role.admin && (
        <button onClick={deleteAllStudents}>Delete All Students</button>
      )}
    </>
  );
}
