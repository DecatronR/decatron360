"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Search } from "lucide-react";
import { roleGroups, roleMenus } from "@/config/mobileMenuConfig";

const MobileNavbar = () => {
  const { user } = useAuth();

  const renderMenuItems = () => {
    if (!user) {
      return (
        <Link
          className="flex flex-col items-center"
          href="/property-requests/login"
        >
          <LogIn className="h-6 w-6" />
          <span className="text-xs">Login</span>
        </Link>
      );
    }

    const group = roleGroups[user.role];
    const menus = roleMenus[group] || [];

    return menus.map((menu, idx) => {
      const Icon = menu.icon;
      const path = menu.href(user.id);

      return (
        <Link
          key={idx}
          className="flex flex-col items-center"
          href={path}
          role="menuitem"
        >
          <Icon className="h-6 w-6" />
          <span className="text-xs">{menu.label}</span>
        </Link>
      );
    });
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 md:hidden"
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-around items-center text-gray-600">
        <Link className="flex flex-col items-center" href="/" role="menuitem">
          <Search className="h-6 w-6" />
          <span className="text-xs">Explore</span>
        </Link>
        {renderMenuItems()}
      </div>
    </div>
  );
};

export default MobileNavbar;
