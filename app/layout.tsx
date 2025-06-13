import type { Metadata } from "next";
import "./globals.css";
import { ENV } from "@/lib/env";
import { CSPostHogProvider } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { Role } from "@/types";
import Header from "@/components/Header";
import { Roboto_Mono } from "next/font/google";
import { CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "CS391 Attendance",
  description: "An attendance application for CS391 at Boston University.",
};

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {ENV === "dev" && (
        <head>
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        </head>
      )}
      <body className={robotoMono.className}>
        <CSPostHogProvider>
          <Suspense
            fallback={
              <>
                <Header role={Role.student} />
                <div className="flex justify-center items-center w-full p-20">
                  <CircularProgress color="primary" size={100} />
                </div>
              </>
            }
          >
            {children}
            <SpeedInsights />
          </Suspense>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
