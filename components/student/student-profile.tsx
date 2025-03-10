"use client";
import Image from "next/image";
import "react-day-picker/style.css";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceForm from "./AttendanceForm";
import { useStudentContext } from "./StudentContext";

export default function StudentProfile() {
  const { user } = useStudentContext();

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
      <AttendanceForm />
      <AttendanceCalendar />
    </div>
  );
}
