"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import UserDashboard from "@/components/UserDashboard/UserDashboard";
import Spinner from "@/components/ui/Spinner";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has appropriate role
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Only allow specific roles to access the dashboard
    const allowedRoles = ["agent", "owner", "caretaker", "property-manager"];
    if (!allowedRoles.includes(user.role)) {
      router.push("/user-profile");
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <UserDashboard />;
};

export default UserDashboardPage;
