import type { Metadata } from "next";
import "./globals.css";
import { ENV } from "@/lib/env";
import { CSPostHogProvider } from "./providers";

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
        </head>
      )}
      <body>
        <header className="font-bold text-4xl p-4 text-center md:text-left">
          CS391 Attendance
        </header>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}
