import { allUsers } from "@/lib/allUsers";
import { getAttendanceList } from "@/lib/attendanceList";
import { userFromCookies } from "@/lib/cookies";
import { Role } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const allowedRoles = [Role.staff, Role.admin];

function attendanceListToCSV(attendanceList: string[][]): string {
  let csvString = "";

  for (const row of attendanceList) {
    for (const cell of row) {
      csvString += cell + ", ";
    }
    csvString += "\n";
  }

  return csvString;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await userFromCookies(req.cookies);
  if (!user || !allowedRoles.includes(user.role)) {
    return NextResponse.redirect("/");
  }

  const date = new Date()
    .toLocaleString("en-us", {
      timeZone: "America/New_York",
    })
    .replaceAll("/", "-")
    .split(", ")[0];
  console.log(date);
  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename=cs391-${date}.csv`);
  headers.set("Content-Type", "text/plain");

  // Return the file with the content "hello"
  return new NextResponse(
    attendanceListToCSV(getAttendanceList(await allUsers())),
    {
      status: 200,
      headers,
    },
  );
}
