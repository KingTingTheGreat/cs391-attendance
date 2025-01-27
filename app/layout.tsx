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
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </body>
    </html>
  );
}
