import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  ClipboardList,
  CalendarDays,
  GitBranch,
  User,
  LogIn,
  Heart,
} from "lucide-react";

const MobileNavbar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogin = () => {
    router.replace("/auth/login");
  };

  const privilegedRoles = ["agent", "owner", "property manager", "admin"];
  const isPrivilegedUser = user && privilegedRoles.includes(user.role);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 md:hidden z-100">
      <div className="flex justify-around items-center text-gray-600">
        {/* Common Explore Button */}
        <Link className="flex flex-col items-center" href="/" role="menuitem">
          <Search className="h-6 w-6" />
          <span className="text-xs">Explore</span>
        </Link>

        {user ? (
          isPrivilegedUser ? (
            <>
              {/* Inspections */}
              <Link
                className="flex flex-col items-center"
                href={`/my-inspections/${user.id}`}
                role="menuitem"
              >
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Inspections</span>
              </Link>

              {/* Availability */}
              <Link
                className="flex flex-col items-center"
                href={`/agent-scheduler/${user.id}`}
                role="menuitem"
              >
                <CalendarDays className="h-6 w-6" />
                <span className="text-xs">Availability</span>
              </Link>

              {/* Networks */}
              <Link
                className="flex flex-col items-center"
                href={
                  ["owner", "propertyManager", "caretaker"].includes(user.role)
                    ? "/owner-network-map"
                    : "/agent-network-map"
                }
                role="menuitem"
              >
                <GitBranch className="h-6 w-6" />
                <span className="text-xs">Networks</span>
              </Link>
            </>
          ) : (
            <>
              {/* Default User Menu */}
              <Link
                className="flex flex-col items-center"
                href="/properties/favorite"
                role="menuitem"
              >
                <Heart className="h-6 w-6" />
                <span className="text-xs">Favorites</span>
              </Link>

              <Link
                className="flex flex-col items-center"
                href={`/my-inspections/${user.id}`}
                role="menuitem"
              >
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Inspections</span>
              </Link>
            </>
          )
        ) : (
          // Show Login Button for non-logged-in users
          <Link className="flex flex-col items-center" href="/auth/login">
            <LogIn className="h-6 w-6" />
            <span className="text-xs">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
