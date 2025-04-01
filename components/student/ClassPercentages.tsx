import { Class } from "@/types";
import { useStudentContext } from "./StudentContext";
import formatPercentage from "@/lib/util/formatPercentage";

export default function ClassPercentages() {
  const { user, attendanceDates } = useStudentContext();

  if (!attendanceDates) return <></>;

  return (
    <div className="px-2 pb-1 mb-4">
      {Object.values(Class).map((clsType) => {
        const numPresent = user.attendanceList.filter(
          (d) => d.class === clsType,
        ).length;
        console.log("attendanceDates", clsType, attendanceDates[clsType]);
        return (
          <div key={clsType}>
            <p>
              {clsType}:{" "}
              {formatPercentage(numPresent, attendanceDates[clsType].size)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
