"use client";
import { deleteAllStudents } from "@/lib/control/deleteAllStudents";
import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { useUsersContext } from "./UsersContext";
import { Role } from "@/types";

export default function DeleteAllStudents() {
  const [open, setOpen] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const { setUsers } = useUsersContext();

  return (
    <div className="w-fit p-2 m-2 flex flex-col items-center">
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ margin: "0.25rem" }}
      >
        Delete All Students
      </Button>
      <p className="text-center">{resMsg}</p>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-44 bg-white rounded-3xl flex flex-col items-center justify-center"
        >
          <p className="text-xl p-1 m-2 text-center">
            Are you sure you want to delete all students? This action is{" "}
            <span className="text-[#F00] font-semibold">permanent</span> and{" "}
            <span className="text-[#F00] font-semibold">irreverisble</span>.
          </p>
          <div className="w-[60%] flex justify-between">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                deleteAllStudents().then((res) => {
                  if (res.success) {
                    setUsers((users) =>
                      users.filter((user) => user.role !== Role.student),
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
        </div>
      </Modal>
    </div>
  );
}
