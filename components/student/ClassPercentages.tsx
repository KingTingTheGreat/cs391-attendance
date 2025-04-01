import { Class } from "@/types";
import { useStudentContext } from "./StudentContext";
import formatPercentage from "@/lib/util/format";

const minPercentage = 80;

export default function ClassPercentages() {
  const { user, attendanceDates } = useStudentContext();

  if (!attendanceDates) return <></>;

  return (
    <div className="px-2 pb-1 mb-4">
      {Object.values(Class).map((clsType) => {
        const numPresent = user.attendanceList.filter(
          (d) => d.class === clsType,
        ).length;
        const percentage = formatPercentage(
          numPresent,
          attendanceDates[clsType].size,
        );
        return (
          <div key={clsType}>
            <p>
              {clsType}:{" "}
              <span
                className={
                  percentage >= minPercentage
                    ? "text-green-700"
                    : "text-red-500 underline"
                }
              >
                {percentage}%
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
