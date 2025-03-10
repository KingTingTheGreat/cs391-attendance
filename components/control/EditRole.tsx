"use client";
import { EditUserRole } from "@/lib/control/editUserRole";
import { Role, UserProps } from "@/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "@/components/control/UsersContext";
import UserSelect from "./UserSelect";

export default function EditRole() {
  const { users, setUsers } = useUsersContext();
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [newRole, setNewRole] = useState<Role | string>("");
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block w-xs mx-3">
      <h3 className="text-2xl font-semibold text-center w-full m-3">
        Edit User Role
      </h3>
      <UserSelect
        val={selectedUser}
        setVal={setSelectedUser}
        filterFunc={(user) => user.role !== Role.admin}
      />
      <div className="flex justify-between w-full m-[0.25rem] mt-2">
        <Autocomplete
          disablePortal
          options={Object.keys(Role)
            .filter((r) => r !== Role.admin)
            .map((r) => r as string)}
          sx={{
            width: "150px",
          }}
          renderInput={(params) => <TextField {...params} label="Role" />}
          value={newRole}
          onChange={(_, val) => setNewRole(val ? (val as Role) : "")}
        />
        <Button
          disabled={!(selectedUser && newRole)}
          variant="contained"
          onClick={() => {
            if (selectedUser && newRole) {
              EditUserRole(selectedUser.email, newRole as Role).then((res) => {
                if (res.success) {
                  setUsers(
                    users.map((user) =>
                      user.email === selectedUser.email
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
      </div>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
