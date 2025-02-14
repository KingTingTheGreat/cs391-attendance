"use client";
import { EditUserRole } from "@/lib/control/editUserRole";
import { Role } from "@/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "@/components/control/users-context";

export default function EditRole() {
  const { users, setUsers } = useUsersContext();
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [newRole, setNewRole] = useState<Role | string>("");
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block">
      <h3 className="text-2xl font-semibold text-center w-full">
        Edit User Role
      </h3>
      <Autocomplete
        disablePortal
        options={users
          .filter((user) => user.role !== Role.admin)
          .map((user) => user.email)}
        sx={{
          width: `${(selectedEmail.length || 0) * 6 + 150}px`,
          margin: "0.25rem",
        }}
        renderInput={(params) => <TextField {...params} label="Email" />}
        value={selectedEmail}
        onChange={(_, val) => setSelectedEmail(val as string)}
      />
      <Autocomplete
        disablePortal
        options={Object.keys(Role)
          .filter((r) => r !== Role.admin)
          .map((r) => r as string)}
        sx={{
          width: "150px",
          margin: "0.25rem",
        }}
        renderInput={(params) => <TextField {...params} label="Role" />}
        value={newRole}
        onChange={(_, val) => setNewRole(val ? (val as Role) : "")}
      />
      <Button
        disabled={!(selectedEmail && newRole)}
        variant="contained"
        sx={{ margin: "0.25rem" }}
        onClick={() => {
          if (selectedEmail && newRole) {
            EditUserRole(selectedEmail, newRole as Role).then((res) => {
              if (res.success) {
                setUsers(
                  users.map((user) =>
                    user.email === selectedEmail
                      ? { ...user, role: newRole as Role }
                      : user,
                  ),
                );
              }
              setResMsg(res.message);
            });
          }
        }}
      >
        Edit Role
      </Button>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
