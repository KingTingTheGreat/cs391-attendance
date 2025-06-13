"use client";
import { useActionState, useState } from "react";
import PasswordField from "./PasswordField";
import { Button } from "@mui/material";
import { setUserPassword } from "@/lib/password/setUserPassword";

const successMessage = "successfully set new password";

export default function PasswordPanel() {
  const [newPw1, setNewPw1] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const [error, submitAction, pending] = useActionState(async () => {
    try {
      if (newPw1 !== newPw2) {
        return "passwords do not match";
      }

      const res = await setUserPassword(newPw1);
      if (!res.success) {
        return res.message;
      }

      return successMessage;
    } catch {
      return "something went wrong. please try again later.";
    }
  }, null);

  return (
    <>
      <form action={submitAction} className="px-4 py-6">
        <PasswordField val={newPw1} setVal={setNewPw1} idLabel="New Password" />
        <PasswordField
          val={newPw2}
          setVal={setNewPw2}
          idLabel="Repeat New Password"
        />
        {error === null ? (
          <></>
        ) : error !== successMessage ? (
          <p className="text-center text-base text-[#F00] min-h-8 mt-2">
            {error}
          </p>
        ) : (
          <p className="text-center text-base min-h-8 mt-2">{error}</p>
        )}
        <Button
          type="submit"
          variant="outlined"
          disabled={pending}
          sx={{ margin: "0.5rem" }}
        >
          {!pending ? "Submit" : "Submitting..."}
        </Button>
      </form>
    </>
  );
}
