"use client";
import { deleteAllStudents } from "@/lib/control/deleteAllStudents";

export default function AdminPanel() {
  return (
    <div>
      <h1>Admin Page</h1>
      <button onClick={deleteAllStudents}>Delete All Students</button>
    </div>
  );
}
