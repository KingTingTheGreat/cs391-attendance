"use client";
import { deleteUser } from "@/lib/control/deleteUser";
import { Role } from "@/types";
import { Button, MenuItem, Modal, Select } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "@/components/control/users-context";

export default function DeleteUser() {
  const { users, setUsers } = useUsersContext();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="p-2 m-2 w-fit">
      <h3 className="text-2xl font-semibold text-center w-full">
        Delete a User
      </h3>
      <Select
        value={email}
        onChange={(e) => setEmail(e.target.value as string)}
        sx={{ minWidth: 150, width: "fit-content", margin: "0.25rem" }}
      >
        <MenuItem value=""></MenuItem>
        {users
          .filter((user) => user.role !== Role.admin)
          .map((user) => (
            <MenuItem key={user.email} value={user.email}>
              {user.email}
            </MenuItem>
          ))}
      </Select>
      <Button
        disabled={email.length === 0}
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ margin: "0.25rem" }}
      >
        Delete User
      </Button>
      <p className="text-center">{errorMessage}</p>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-52 bg-white rounded-3xl flex flex-col items-center justify-center"
        >
          <h5 className="text-xl p-1 m-2 text-center">
            Delete user with the email:{" "}
            <span className="text-[#F00] font-semibold">{email}</span>? This
            action is{" "}
            <span className="text-[#F00] font-semibold">permanent</span> and{" "}
            <span className="text-[#F00] font-semibold">irreverisble</span>.
          </h5>
          <div className="w-[60%] flex justify-between">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                deleteUser(email).then((res) => {
                  if (res.success) {
                    setUsers(users.filter((user) => user.email !== email));
                  }
                  setErrorMessage(res.message);
                  setOpen(false);
                })
              }
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
