"use client";
import markAsPresent from "@/lib/student/markAsPresent";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Class, UserProps } from "@/types";
import { formatDate } from "@/lib/util/format";
import { Button, TextField } from "@mui/material";

export default function StudentProfile({
  userInput,
}: {
  userInput: UserProps;
}) {
  const [user, setUser] = useState(userInput);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [present, setPresent] = useState(
    user.attendanceList.length > 0 &&
      formatDate(user.attendanceList[user.attendanceList.length - 1].date) ===
        formatDate(new Date()),
  );
  const [isPending, startTransition] = useTransition();

  const interactive = !present ? (
    <form
      action={() => {
        startTransition(() => {
          markAsPresent(code).then((errMsg) => {
            if (errMsg === null) {
              setUser({
                ...user,
                attendanceList: [
                  ...user.attendanceList,
                  {
                    class: Class.Lecture,
                    date: new Date(),
                  },
                ],
              });
              setPresent(true);
              setErrorMessage("");
            } else {
              setErrorMessage(errMsg);
            }
          });
        });
      }}
      className="flex flex-col w-72"
    >
      <TextField
        type="text"
        value={code}
        placeholder="Today's Code"
        variant="outlined"
        sx={{ margin: "0.1rem" }}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
        sx={{ margin: "0.1rem" }}
      >
        {isPending
          ? "Marking you as present..."
          : "Click to indicate you're in class"}
      </Button>
    </form>
  ) : (
    <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
      You have been marked present for today!
    </div>
  );

  return (
    <div className="p-8">
      <p className="text-2xl font-bold text-center mb-6">
        Hello there, {user.name}!
      </p>
      <div className="flex justify-center mb-6">
        <Image
          src={user.picture}
          alt="profile picture"
          width={128}
          height={128}
          className="rounded-full"
        />
      </div>
      <div className="flex justify-center">{interactive}</div>
      <p className="p-2 text-lg text-[#F00]">{errorMessage}</p>
      <div className="p-2 m-2">
        <h4 className="text-center font-semibold">
          Dates you&apos;ve been marked as present:
        </h4>
        {user.attendanceList.map((att) => (
          <p key={formatDate(att.date)}>{formatDate(att.date)}</p>
        ))}
      </div>
    </div>
  );
}
