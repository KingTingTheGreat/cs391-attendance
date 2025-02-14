"use client";
import { deleteUser } from "@/lib/control/deleteUser";
import { Role } from "@/types";
import { Autocomplete, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "@/components/control/users-context";

export default function DeleteUser() {
  const { users, setUsers } = useUsersContext();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block">
      <h3 className="text-2xl font-semibold text-center w-full">
        Delete a User
      </h3>{" "}
      <Autocomplete
        disablePortal
        options={users
          .filter((user) => user.role !== Role.admin)
          .map((user) => user.email)}
        sx={{
          width: `${(email.length || 0) * 6 + 150}px`,
          margin: "0.25rem",
        }}
        renderInput={(params) => <TextField {...params} label="Email" />}
        value={email}
        onChange={(_, val) => setEmail(val as string)}
      />
      <Button
        disabled={email.length === 0}
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ margin: "0.25rem" }}
      >
        Delete User
      </Button>
      <p className="text-center">{resMsg}</p>
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
                  setResMsg(res.message);
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
