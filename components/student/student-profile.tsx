"use client";
import Image from "next/image";
import { useState } from "react";
import { UserProps } from "@/types";
import "react-day-picker/style.css";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceForm from "./AttendanceForm";

export default function StudentProfile({
  userInput,
}: {
  userInput: UserProps;
}) {
  const [user, setUser] = useState(userInput);

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
      <AttendanceForm user={user} setUser={setUser} />
      <AttendanceCalendar user={user} />
    </div>
  );
}
