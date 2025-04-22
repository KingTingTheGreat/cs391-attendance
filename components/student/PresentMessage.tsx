import { Class } from "@/types";

export default function PresentMessage({ classType }: { classType: Class }) {
  return (
    <div className="text-center p-4 w-96 bg-green-100 text-green-700 rounded-md">
      You have been marked present in{" "}
      <span className="underline">{classType}</span> today!
    </div>
  );
}
