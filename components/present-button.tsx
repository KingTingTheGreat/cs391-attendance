"use client";
import markAsPresent from "@/lib/markAsPresent";

export default function PresentButton() {
  return (
    <div>
      <p>Were you in class today?</p>
      <button
        onClick={() =>
          markAsPresent().then((res) => alert("marked as present" + res))
        }
      >
        Yes
      </button>
      <button>No</button>
    </div>
  );
}
