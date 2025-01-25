"use client";
import markAsPresent from "@/lib/markAsPresent";
import { useState } from "react";
import Loading from "./loading";

export default function PresentButton({
  presentInput,
}: {
  presentInput: boolean | undefined;
}) {
  const [present, setPresent] = useState(presentInput);

  if (present === undefined) return <Loading />;
  if (present) {
    return <div>marked present</div>;
  }

  return (
    <div>
      <p>Were you in class today?</p>
      <button
        onClick={() =>
          markAsPresent().then((res) => {
            alert("marked as present" + res);
            setPresent(presentInput || res);
          })
        }
      >
        Yes
      </button>
      <button>No</button>
    </div>
  );
}
