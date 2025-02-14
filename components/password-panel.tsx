"use client";

import { useState } from "react";
import PasswordField from "./password-field";
import { Button } from "@mui/material";

export default function PasswordPanel() {
  const [curPw, setCurPw] = useState("");
  const [newPw1, setNewPw1] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [errMsg, setErrMsg] = useState(" ");

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newPw1 !== newPw2) {
            setErrMsg("new passwords do not match");
          } else if (newPw1.length < 7) {
            setErrMsg("password must be at least 7 characters long");
          } else {
            setErrMsg("");
          }
        }}
        className="px-4 py-6"
      >
        <PasswordField
          val={curPw}
          setVal={setCurPw}
          idLabel="Current Password"
        />
        <PasswordField val={newPw1} setVal={setNewPw1} idLabel="New Password" />
        <PasswordField
          val={newPw2}
          setVal={setNewPw2}
          idLabel="Repeat New Password"
        />
        <p className="text-center text-[#F00] min-h-8">{errMsg}</p>
        <Button type="submit" variant="outlined">
          Submit
        </Button>
      </form>
    </>
  );
}
