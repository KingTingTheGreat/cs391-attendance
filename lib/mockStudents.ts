import { Class, Role, AttendanceProps, UserProps } from "@/types";
import { formatDate } from "./attendanceList";

function perc(): number {
  const range = 100 + 1;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomValue = randomBuffer[0] % range;
  return randomValue;
}

function randName() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

function randClassDates(): Date[] {
  const n = Math.floor(Math.random() * 50 + 5);

  const uniqueDates = new Set<string>();
  const now = new Date();
  const later = new Date(now);
  later.setMonth(now.getMonth() + 2);
  const dates: Date[] = [];
  for (let i = 0; i < n; i++) {
    const newDate = new Date(
      Math.random() * (later.getTime() - now.getTime()) + now.getTime(),
    );
    if (!uniqueDates.has(formatDate(newDate))) {
      uniqueDates.add(formatDate(newDate));
      dates.push(newDate);
    }
  }
  dates.sort((a, b) => a.getTime() - b.getTime());

  return dates;
}

function randStudent(classDates: Date[]): UserProps {
  const attendanceList: AttendanceProps[] = [];
  for (const d of classDates) {
    const p = perc();
    if (p < 80) {
      attendanceList.push({
        date: d,
        class: Class.Lecture,
      });
    }
  }

  return {
    name: randName(),
    email: randName() + "@bu.edu",
    picture: "hi",
    role: Role.student,
    attendanceList,
  };
}

export function mockStudents(): UserProps[] {
  const classDates = randClassDates();

  const n = Math.ceil(Math.random() * 100) + 20;
  const students: UserProps[] = [];
  for (let i = 0; i < n; i++) {
    students.push(randStudent(classDates));
  }

  return students;
}
