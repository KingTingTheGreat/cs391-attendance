"use client";
import { PREV_QRCODE_SIZE_COOKIE } from "@/lib/cookies/cookies";
import Cookie from "js-cookie";
import { Slider } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function QRCodeDisplay() {
  const [domain, setDomain] = useState("");
  const prevSize = Number(Cookie.get(PREV_QRCODE_SIZE_COOKIE));
  const [size, setSize] = useState(isNaN(prevSize) ? 256 : prevSize);

  useEffect(() => {
    const currentDomain = window.location.origin;
    setDomain(currentDomain);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl p-2 m-1">
        Visit{" "}
        <Link href={domain} className="underline">
          {domain}
        </Link>
      </p>
      <Slider
        value={size}
        sx={{ width: "30vw" }}
        valueLabelDisplay="auto"
        min={64}
        max={1024}
        onChange={(_, val) => {
          setSize(val as number);
          Cookie.set(PREV_QRCODE_SIZE_COOKIE, val.toString());
        }}
      />
      <div className="flex justify-center p-2 m-2">
        <QRCode value={domain} size={size} />
      </div>
    </div>
  );
}
