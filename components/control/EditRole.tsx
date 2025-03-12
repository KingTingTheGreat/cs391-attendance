"use client";
import { editUserRole } from "@/lib/control/editUserRole";
import { Role, UserProps } from "@/types";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useActionState, useState } from "react";
import { useUsersContext } from "@/components/control/UsersContext";
import UserSelect from "./UserSelect";

export default function EditRole() {
  const { users, setUsers } = useUsersContext();
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [resMsg, setResMsg] = useState("");

  const [error, submitAction, isPending] = useActionState(async () => {
    try {
      if (!selectedUser) throw new Error("no user selected");
      setResMsg(await editUserRole(selectedUser.email, newRole as Role));
      setUsers(
        users.map((user) =>
          user.email === selectedUser.email
            ? { ...user, role: newRole as Role }
            : user,
        ),
      );

      return null;
    } catch (e) {
      setResMsg("");
      return e as Error;
    }
  }, null);

  return (
    <form
      className="p-2 m-2 w-fit flex flex-col lg:block w-xs mx-3"
      action={submitAction}
    >
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
          disabled={isPending}
          options={Object.keys(Role)
            .filter((r) => r !== Role.admin)
            .map((r) => r as string)}
          sx={{
            width: "150px",
          }}
          renderInput={(params) => <TextField {...params} label="Role" />}
          value={newRole}
          onChange={(_, val) => setNewRole(val ? (val as Role) : null)}
        />
        <Button
          disabled={isPending || !(selectedUser && newRole)}
          variant="contained"
          type="submit"
        >
          Edit Role
        </Button>
      </div>
      <p className="text-center text-[#F00]">{error && error.message}</p>
      <p className="text-center">{resMsg}</p>
    </form>
  );
}
