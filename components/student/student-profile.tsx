"use client";
import markAsPresent from "@/lib/student/markAsPresent";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Class, UserProps } from "@/types";
import { formatDate } from "@/lib/util/format";
import { Button, TextField } from "@mui/material";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import "react-day-picker/style.css";
import AttendanceCalendar from "./AttendanceCalendar";

export default function StudentProfile({
  userInput,
}: {
  userInput: UserProps;
}) {
  const [user, setUser] = useState(userInput);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formatToday = formatDate(new Date());
  const [present, setPresent] = useState(
    user.attendanceList.some((att) => formatDate(att.date) === formatToday),
  );
  const [isPending, startTransition] = useTransition();

  const processPresentRes = (errMsg: string | null) => {
    if (errMsg === null) {
      setUser({
        ...user,
        attendanceList: addToAttendanceList(user.attendanceList, {
          class: Class.lecture,
          date: new Date(),
        }),
      });
      setPresent(true);
      setErrorMessage("");
    } else {
      setErrorMessage(errMsg);
    }
  };

  const interactive = !present ? (
    <form
      action={() => {
        startTransition(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              markAsPresent(
                code,
                pos.coords.longitude,
                pos.coords.latitude,
              ).then(processPresentRes);
            });
          } else {
            markAsPresent(code).then(processPresentRes);
          }
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
    <div>
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
      <AttendanceCalendar user={user} />
    </div>
  );
}
