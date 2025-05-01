"use client";
import { PREV_QRCODE_SIZE_COOKIE } from "@/lib/cookies/cookies";
import Cookie from "js-cookie";
import { Slider } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const defaultSize = 256;
const defaultDomain = process.env.NEXT_PUBLIC_DOMAIN || "";

function createDomain(domain: string, code?: string) {
  if (code !== undefined) {
    return `${domain}?code=${code}`;
  }
  return domain;
}

export default function QRCodeDisplay({
  prevSize,
  code,
}: {
  prevSize?: number;
  code?: string;
}) {
  const [domain, setDomain] = useState(createDomain(defaultDomain, code));
  const [size, setSize] = useState(
    isNaN(prevSize || NaN) ? defaultSize : (prevSize as number),
  );

  useEffect(() => {
    const currentDomain = window.location.origin;
    setDomain(createDomain(currentDomain, code));
  }, [code]);

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
        valueLabelDisplay="off"
        min={64}
        max={1024}
        onChange={(_, val) => {
          setSize(val as number);
          Cookie.set(PREV_QRCODE_SIZE_COOKIE, val.toString(), {
            maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
            path: "/",
          });
        }}
      />
      <div className="flex justify-center p-2 m-2 pb-32">
        <QRCode value={domain} size={size} />
      </div>
    </div>
  );
}
