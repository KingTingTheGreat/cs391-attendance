import { Role } from "@/types";
import Link from "next/link";

const allowedRoles = [Role.staff, Role.admin];

export default function Header({ role }: { role?: Role }) {
  return (
    <header className="pb-0 md:pb-4 p-4 flex flex-col lg:flex-row lg:justify-between items-center">
      <Link href="/" className="text-3xl md:text-4xl font-bold text-center">
        CS391 Attendance
      </Link>
      {role && allowedRoles.includes(role) && (
        <nav className="text-lg md:text-2xl font-semibold flex justify-center text-center">
          <Link href="/code" className="p-1 md:p-2 m-1 md:m-2 hover:underline">
            Today&apos;s Code
          </Link>
          <Link
            href="/temporary-code"
            className="p-1 md:p-2 m-1 md:m-2 hover:underline"
          >
            Temporary Code
          </Link>
          <Link href="/admin" className="p-1 md:p-2 m-1 md:m-2 hover:underline">
            Admin Panel
          </Link>
        </nav>
      )}
    </header>
  );
}
