import React from "react";
import { useRouter } from "next/navigation";
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

  const privilegedRoles = ["agent", "owner", "property manager"];
  const isPrivilegedUser = user && privilegedRoles.includes(user.role);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 md:hidden">
      <div className="flex justify-around items-center text-gray-600">
        {/* Common Explore Button */}
        <button className="flex flex-col items-center">
          <Search className="h-6 w-6" />
          <span className="text-xs">Explore</span>
        </button>

        {user ? (
          isPrivilegedUser ? (
            <>
              {/* Inspections */}
              <button className="flex flex-col items-center">
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Inspections</span>
              </button>

              {/* Availability */}
              <button className="flex flex-col items-center">
                <CalendarDays className="h-6 w-6" />
                <span className="text-xs">Availability</span>
              </button>

              {/* Networks */}
              <button className="flex flex-col items-center">
                <GitBranch className="h-6 w-6" />
                <span className="text-xs">Networks</span>
              </button>

              {/* Profile */}
              <button className="flex flex-col items-center">
                <User className="h-6 w-6" />
                <span className="text-xs">Profile</span>
              </button>
            </>
          ) : (
            <>
              {/* Default User Menu */}
              <button className="flex flex-col items-center">
                <Heart className="h-6 w-6" />
                <span className="text-xs">Favorites</span>
              </button>

              <button className="flex flex-col items-center">
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Inspections</span>
              </button>

              <button className="flex flex-col items-center">
                <User className="h-6 w-6" />
                <span className="text-xs">Profile</span>
              </button>
            </>
          )
        ) : (
          // Show Login Button for non-logged-in users
          <button className="flex flex-col items-center" onClick={handleLogin}>
            <LogIn className="h-6 w-6" />
            <span className="text-xs">Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
