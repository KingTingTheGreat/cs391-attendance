"use client";
import { formatDate } from "@/lib/util/format";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { useUsersContext } from "@/components/control/UsersContext";
import { Class } from "@/types";

export default function DownloadSheet({ classType }: { classType: Class }) {
  const { lecAttList, discAttList } = useUsersContext();
  const attendanceList = classType === Class.lecture ? lecAttList : discAttList;

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
