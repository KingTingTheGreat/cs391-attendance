"use client";
import markAsPresent from "@/lib/student/markAsPresent";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Class, UserProps } from "@/types";
import { formatDate } from "@/lib/util/format";
import { Button } from "@mui/material";

export default function StudentProfile({
  userInput,
}: {
  userInput: UserProps;
}) {
  const [user, setUser] = useState(userInput);
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
          markAsPresent().then((res) => {
            if (res) {
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
            } else {
              setErrorMessage("something weng wrong. please try again.");
            }
            setPresent(res);
          });
        });
      }}
    >
      <Button type="submit" variant="contained" disabled={isPending}>
        Click to indicate you&apos;re in class
      </Button>
    </form>
  ) : (
    <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
      {isPending
        ? "Marking you as present..."
        : "You have been marked present for today!"}
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
      {interactive}
      <p className="p-2 text-[#F00]">{errorMessage}</p>
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
