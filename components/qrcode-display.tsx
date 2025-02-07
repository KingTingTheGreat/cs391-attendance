"use client";
import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function QRCodeDisplay() {
  const [domain, setDomain] = useState("");
  const [size, setSize] = useState(256);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    setDomain(currentDomain);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Slider
        value={size}
        sx={{ width: "30vw" }}
        valueLabelDisplay="auto"
        min={64}
        max={1024}
        onChange={(_, val) => {
          setSize(val as number);
        }}
      />
      <div className="flex justify-center p-2 m-2">
        <QRCode value={domain} size={size} />
      </div>
    </div>
  );
}
