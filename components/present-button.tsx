"use client";
import markAsPresent from "@/lib/markAsPresent";
import { useState } from "react";
import Loading from "./loading";
import { UserProps } from "@/types";
import { formatDate } from "@/lib/attendanceList";

export default function PresentButton({ user }: { user: UserProps }) {
  const [present, setPresent] = useState(
    user.attendanceList &&
      user.attendanceList.length > 0 &&
      formatDate(user.attendanceList[user.attendanceList.length - 1].date) ===
        formatDate(new Date()),
  );

  if (present === undefined) return <Loading />;
  if (present) {
    return (
      <div>
        <p>You have been marked present!</p>
      </div>
    );
  }

  return (
    <div>
      <p>Were you in class today?</p>
      <button onClick={() => markAsPresent().then((res) => setPresent(res))}>
        Yes
      </button>
      <button>No</button>
    </div>
  );
}
