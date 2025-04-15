"use client";
import { CODE_LENGTH } from "@/lib/generateCode";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function CodeDisplay({
  code,
  show,
}: {
  code?: string;
  show?: boolean;
}) {
  const [visible, setVisible] = useState(show || false);

  return (
    <div
      className="flex items-center text-6xl font-bold tracking-wider bg-gray-200 p-4 rounded-lg cursor-pointer"
      onClick={() => code && setVisible(!visible)}
    >
      <p>{visible && code ? code : "•".repeat(CODE_LENGTH)}</p>
      <div className="pl-4 flex items-center">
        {visible && code ? (
          <VisibilityOff fontSize="large" />
        ) : (
          <Visibility fontSize="large" />
        )}
      </div>
    </div>
  );
}
