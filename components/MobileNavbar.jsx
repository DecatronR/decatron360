import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Search, Heart, ClipboardList, User, LogIn } from "lucide-react";

const MobileNavbar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogin = () => {
    router.replace("/auth/login");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 md:hidden">
      <div className="flex justify-around items-center text-gray-600">
        {/* Explore */}
        <button className="flex flex-col items-center">
          <Search className="h-6 w-6" />
          <span className="text-xs">Explore</span>
        </button>

        {/* Favorites */}
        <button className="flex flex-col items-center">
          <Heart className="h-6 w-6" />
          <span className="text-xs">Favorites</span>
        </button>

        {/* Show different options based on login state */}
        {user ? (
          <>
            {/* Inspections (Only for logged-in users) */}
            <button className="flex flex-col items-center">
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs">Inspections</span>
            </button>

            {/* Profile (Only for logged-in users) */}
            <button className="flex flex-col items-center">
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </button>
          </>
        ) : (
          /* Sign In (Only for non-logged-in users) */
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
