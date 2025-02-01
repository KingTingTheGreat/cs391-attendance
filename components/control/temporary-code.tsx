"use client";
import CodeDisplay from "../code-display";
import { useState } from "react";

export default function TemporaryCode() {
  const [tempCode, setTempCode] = useState<string | null>(null);

  return (
    <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
      <h2 className="text-2xl font-bold text-center">Today&apos;s Code</h2>
      <div className="flex flex-col items-center space-y-6">
        <CodeDisplay code="121212" />
        <p className="text-center text-gray-600">
          Use this code to confirm your attendance
        </p>
      </div>
    </div>
  );
}
