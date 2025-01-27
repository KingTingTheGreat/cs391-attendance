import { Role } from "@/types";
import Link from "next/link";

const allowedRoles = [Role.staff, Role.admin];

export default function Header({ role }: { role?: Role }) {
  return (
    <header className="p-4 flex flex-col lg:flex-row lg:justify-between items-center">
      <Link href="/" className="text-3xl md:text-4xl font-bold text-center">
        CS391 Attendance
      </Link>
      {role && allowedRoles.includes(role) && (
        <nav className="text-lg md:text-2xl font-semibold">
          <Link href="/code" className="p-2 m-2">
            Today&apos;s Code
          </Link>
          <Link href="/admin" className="p-2 m-2">
            Admin Panel
          </Link>
        </nav>
      )}
    </header>
  );
}
