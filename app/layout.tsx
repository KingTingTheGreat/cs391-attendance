import type { Metadata } from "next";
import "./globals.css";
import { ENV } from "@/lib/env";
import { CSPostHogProvider } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { Role } from "@/types";
import Header from "@/components/header";
import Loading from "@/components/loading";

export const metadata: Metadata = {
  title: "CS391 Attendance",
  description: "attendance application for cs391",
};

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
          <style>
            @import
            url(&apos;https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap&apos;);
          </style>
        </head>
      )}
      <body>
        <CSPostHogProvider>
          <Suspense
            fallback={
              <>
                <Header role={Role.student} />
                <Loading />
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
