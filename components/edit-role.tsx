"use client";
import { EditUserRole } from "@/lib/control/editUserRole";
import { Role, UserProps } from "@/types";
import { Button, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function EditRole({ users }: { users: UserProps[] }) {
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [newRole, setNewRole] = useState<Role | string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <div className="p-2 m-2 w-fit">
      <h3 className="text-2xl font-semibold text-center w-full">
        Edit User Role
      </h3>
      <Select
        onChange={(e) => {
          setSelectedEmail(e.target.value as string);
        }}
        value={selectedEmail}
        sx={{ minWidth: 150, width: "fit-content", margin: "0.25rem" }}
      >
        <MenuItem value=""></MenuItem>
        {users.map((user) => (
          <MenuItem key={user.email} value={user.email}>
            {user.email}
          </MenuItem>
        ))}
      </Select>
      <Select
        onChange={(e) =>
          setNewRole(e.target.value ? (e.target.value as Role) : "")
        }
        value={newRole}
        sx={{ width: 100, margin: "0.25rem" }}
      >
        <MenuItem value=""></MenuItem>
        {Object.keys(Role).map(
          (role) =>
            role !== Role.admin && (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ),
        )}
      </Select>

      <Button
        disabled={!(selectedEmail && newRole)}
        variant="contained"
        sx={{ margin: "0.25rem" }}
        onClick={() => {
          if (selectedEmail && newRole) {
            EditUserRole(selectedEmail, newRole as Role).then((msg) =>
              setErrorMessage(msg as string),
            );
          }
        }}
      >
        Edit Role
      </Button>
      <p>{errorMessage}</p>
    </div>
  );
}
