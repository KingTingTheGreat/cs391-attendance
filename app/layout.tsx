import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        <header className="font-bold text-4xl p-4">CS391 Attendance</header>
        {children}
      </body>
    </html>
  );
}
