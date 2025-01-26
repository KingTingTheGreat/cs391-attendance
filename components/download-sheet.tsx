"use client";
import { formatDate } from "@/lib/attendanceList";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";

export default function DownloadSheet({
  attendanceList,
}: {
  attendanceList: string[][];
}) {
  return (
    <Button
      sx={{
        margin: "0.5rem",
        padding: "0.5rem",
      }}
      href={URL.createObjectURL(
        new Blob([attendanceList.map((row) => row.join(",")).join("\n")], {
          type: "text/csv",
        }),
      )}
      download={`cs391-attendance_${formatDate(new Date()).replaceAll("/", "-")}.csv`}
    >
      Download
      <DownloadIcon />
    </Button>
  );
}
