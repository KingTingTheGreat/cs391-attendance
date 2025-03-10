"use client";

import { CODE_LENGTH } from "@/lib/generateCode";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function CodeDisplay({ code }: { code: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="flex items-center text-6xl font-bold tracking-wider bg-gray-200 p-4 m-2 rounded-lg cursor-pointer"
      onClick={() => setVisible(!visible)}
    >
      <p>{visible ? code : "•".repeat(CODE_LENGTH)}</p>
      <div className="pl-4 flex items-center">
        {visible ? (
          <VisibilityOff fontSize="large" />
        ) : (
          <Visibility fontSize="large" />
        )}
      </div>
    </div>
  );
}
