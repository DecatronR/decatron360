"use client";

import React from "react";
import { FilePlus2, LayoutList } from "lucide-react";
import { useRouter } from "next/navigation";
import FloatingActionMenu from "./FloatingActionMenu";

const PropertyRequestAction = ({ trigger, isFloating = false }) => {
  const router = useRouter();

  const handleRequestProperty = () => {
    router.push("/property-requests/create");
  };

  const handleViewAllRequests = () => {
    const userId =
      typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
    if (!userId) {
      router.push(`/property-requests/login?redirect=/property-requests`);
      return;
    }
    router.push("/property-requests");
  };

  const requestMenuItems = [
    {
      label: "Create New Request",
      icon: <FilePlus2 size={16} />,
      onClick: handleRequestProperty,
    },
    {
      label: "View All Requests",
      icon: <LayoutList size={16} />,
      onClick: handleViewAllRequests,
    },
  ];

  return (
    <FloatingActionMenu
      trigger={trigger}
      items={requestMenuItems}
      isFloating={isFloating}
      position="bottom-right"
      theme="primary"
    />
  );
};

export default PropertyRequestAction;
