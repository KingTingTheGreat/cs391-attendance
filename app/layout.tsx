import type { Metadata } from "next";
import "./globals.css";
import { ENV } from "@/lib/env";
import { CSPostHogProvider } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { Role } from "@/types";
import Header from "@/components/header";
import Loading from "@/components/loading";
import { Roboto_Mono } from "next/font/google";

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
