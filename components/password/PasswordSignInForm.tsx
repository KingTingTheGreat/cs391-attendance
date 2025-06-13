"use client";
import PasswordField from "@/components/password/PasswordField";
import {
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useActionState, useState } from "react";
import signInWithPassword from "@/lib/password/signInWithPassword";
import { redirect, useRouter } from "next/navigation";

export default function PasswordSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, signInAction, pending] = useActionState(async () => {
    try {
      const newError = await signInWithPassword(email, password);
      if (newError === null) {
        router.push("/");
        return null;
      }
      return newError;
    } catch {
      return "something went wrong. please try again later.";
    }
  }, null);

  return (
    <div className="flex justify-center">
      <form
        className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center"
        action={signInAction}
      >
        <p className="text-sm md:text-lg max-w-3/4 sm:max-w-3/5">
          If you have created a password for this website, you can use it to
          sign in.
        </p>
        <div className="m-2 flex flex-col">
          <div className="p-1">
            <InputLabel htmlFor={"email"}>Email</InputLabel>
            <OutlinedInput
              id={"email"}
              type={"text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end" tabIndex={-1}>
                    <AlternateEmailIcon />
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Email"
            />
          </div>
          <PasswordField
            val={password}
            setVal={setPassword}
            idLabel="Password"
          />
          <div className="p-1">
            <Button type="submit" variant="contained">
              Sign In
            </Button>
          </div>
        </div>
        <p className="text-sm md:text-lg text-[#F00]">{error}</p>
      </form>
    </div>
  );
}
