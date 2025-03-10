"use client";
import { deleteUser } from "@/lib/control/deleteUser";
import { Role, UserProps } from "@/types";
import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "@/components/control/UsersContext";
import UserSelect from "./UserSelect";

export default function DeleteUser() {
  const { users, setUsers } = useUsersContext();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block w-xs mx-3">
      <h3 className="text-2xl font-semibold text-center w-full m-3">
        Delete a User
      </h3>
      <UserSelect
        val={selectedUser}
        setVal={setSelectedUser}
        filterFunc={(user) => user.role !== Role.admin}
      />
      <div className="flex justify-between w-full m-[0.25rem] mt-2">
        <Button
          disabled={!selectedUser}
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ height: "56px" }}
        >
          Delete User
        </Button>
      </div>
      <p className="text-center">{resMsg}</p>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-52 bg-white rounded-3xl flex flex-col items-center justify-center"
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
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  No
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    deleteUser(selectedUser.email).then((res) => {
                      if (res.success) {
                        setUsers(
                          users.filter(
                            (user) => user.email !== selectedUser.email,
                          ),
                        );
                      }
                      setResMsg(res.message);
                      setOpen(false);
                    })
                  }
                >
                  Yes
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
