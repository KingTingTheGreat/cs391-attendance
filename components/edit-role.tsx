"use client";
import { EditUserRole } from "@/lib/control/editUserRole";
import { Role, UserProps } from "@/types";
import { useState } from "react";

export default function EditRole({ users }: { users: UserProps[] }) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <div>
      <h3>All User Emails</h3>
      <select
        onChange={(e) => {
          setSelectedEmail(e.target.value || null);
        }}
      >
        <option></option>
        {users.map((user) => (
          <option key={user.email} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>
      <select onChange={(e) => setNewRole((e.target.value as Role) || null)}>
        <option></option>
        {Object.keys(Role).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <button
        disabled={!(selectedEmail && newRole)}
        onClick={() => {
          if (selectedEmail && newRole) {
            EditUserRole(selectedEmail, newRole).then((msg) =>
              setErrorMessage(msg as string),
            );
          }
        }}
      >
        Edit Role
      </button>
      <p>{errorMessage}</p>
    </div>
  );
}
