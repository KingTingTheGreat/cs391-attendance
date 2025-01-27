"use client";
import { formatDate } from "@/lib/util/format";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { useUsersContext } from "@/components/control/users-context";

export default function DownloadSheet() {
  const { attendanceList } = useUsersContext();

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
