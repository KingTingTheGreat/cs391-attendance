import { Class } from "@/types";
import { todayCode } from "../generateCode";

export default function todayCodeToClass(
  code: string,
  emails: string[],
): { classType: Class; email: string } | null {
  code = code.toUpperCase();
  for (const classType in Class) {
    for (const email of emails) {
      if (code === todayCode(classType as Class, email)) {
        return { classType: classType as Class, email };
      }
    }
  }
  return null;
}
