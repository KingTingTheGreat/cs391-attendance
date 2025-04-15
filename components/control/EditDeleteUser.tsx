"use client";
import { useActionState, useState } from "react";
import { useUsersContext } from "./UsersContext";
import { Role, UserProps } from "@/types";
import { editUserRole } from "@/lib/control/editUserRole";
import UserSelect from "./UserSelect";
import { Autocomplete, Button, Modal, TextField } from "@mui/material";
import { deleteUser } from "@/lib/control/deleteUser";

export default function EditDeleteUser() {
  const { users, setUsers } = useUsersContext();
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [resMsg, setResMsg] = useState("");

  const [roleError, roleAction, rolePending] = useActionState(async () => {
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

  const [deleteError, deleteAction, deletePending] = useActionState(
    async () => {
      try {
        if (!selectedUser) throw new Error("no user selected");
        setResMsg(await deleteUser(selectedUser.email));
        setUsers(users.filter((user) => user.email !== selectedUser.email));
        setSelectedUser(null);

        return null;
      } catch (e) {
        setResMsg("");
        return e as Error;
      } finally {
        setOpen(false);
      }
    },
    null,
  );

  return (
    <form
      className="p-2 m-2 w-82 max-w-82 flex flex-col lg:block mx-3"
      action={roleAction}
    >
      <h3 className="text-2xl font-semibold text-center w-full m-3">
        Edit/Delete User
      </h3>
      <UserSelect
        val={selectedUser}
        setVal={setSelectedUser}
        filterFunc={(user) => user.role !== Role.admin}
        disabled={rolePending || deletePending}
      />
      <div className="flex justify-between w-full m-[0.25rem] mt-2">
        <Autocomplete
          disablePortal
          disabled={rolePending || deletePending}
          options={Object.keys(Role)
            .filter((r) => r !== Role.admin)
            .map((r) => r as string)}
          sx={{
            width: "100%",
          }}
          renderInput={(params) => <TextField {...params} label="Role" />}
          value={newRole}
          onChange={(_, val) => setNewRole(val ? (val as Role) : null)}
        />
      </div>
      <div className="flex justify-between w-full m-[0.25rem] mt-2">
        <Button
          disabled={rolePending || !(selectedUser && newRole)}
          variant="contained"
          type="submit"
          sx={{ width: "40%", height: "50px" }}
        >
          {!rolePending ? "Edit Role" : "Editing..."}
        </Button>
        <Button
          disabled={!selectedUser || deletePending}
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ width: "40%", height: "50px" }}
        >
          Delete User
        </Button>
      </div>
      <p className="text-center text-[#F00]">
        {roleError && roleError.message}
        {deleteError && deleteError.message}
      </p>
      <p className="text-center">{resMsg}</p>
      <Modal open={open} onClose={() => setOpen(false)}>
        <form
          action={deleteAction}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-56 bg-white rounded-3xl flex flex-col items-center justify-center border-2"
        >
          {selectedUser && (
            <>
              <h5 className="text-xl p-1 m-2 text-center">
                Delete user with the email:{" "}
                <span className="text-[#F00] font-semibold">
                  {selectedUser.email}
                </span>
                ? This action is{" "}
                <span className="text-[#F00] font-semibold">permanent</span> and{" "}
                <span className="text-[#F00] font-semibold">irreverisble</span>.
              </h5>
              <div className="w-[60%] flex justify-between">
                <Button
                  variant="outlined"
                  onClick={() => setOpen(false)}
                  disabled={deletePending}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  disabled={deletePending}
                  type="submit"
                >
                  {!deletePending ? "Yes" : "Deleting..."}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </form>
  );
}
