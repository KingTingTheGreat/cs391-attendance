"use client";
import markAsPresent from "@/lib/student/markAsPresent";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { Class, UserProps } from "@/types";
import { formatDate } from "@/lib/util/format";
import { Button, TextField } from "@mui/material";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

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
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos);
          setLongitude(pos.coords.longitude);
          setLatitude(pos.coords.latitude);
        },
        () => console.error("require geolocation permissions"),
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  const interactive = !present ? (
    <form
      action={() => {
        startTransition(() => {
          markAsPresent(code, longitude, latitude).then((errMsg) => {
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
      <div className="p-2 m-2 flex flex-col items-center">
        <h4 className="text-lg md:text-xl text-center font-semibold">
          Dates you&apos;ve been marked as present:
        </h4>
        <DayPicker
          mode="multiple"
          className="m-2"
          onSelect={() => {}}
          selected={[...user.attendanceList.map((att) => att.date)]} // needed for rerender
        />
      </div>
    </div>
  );
}
