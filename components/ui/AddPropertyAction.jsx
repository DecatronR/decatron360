"use client";

import React from "react";
import { HousePlus, LayoutList } from "lucide-react";
import { useRouter } from "next/navigation";
import FloatingActionMenu from "./FloatingActionMenu";

const AddPropertyAction = ({ trigger, isFloating = false }) => {
  const router = useRouter();

  const handleAddProperty = () => {
    router.push("/properties/add/for-rent");
  };

  const handleViewAllRequests = () => {
    const userId =
      typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
    if (!userId) {
      router.push(`/auth/login?redirect=/property-requests`);
    } else {
      router.push("/property-requests");
    }
  };

  const addPropertyMenuItems = [
    {
      label: "List Property",
      icon: <HousePlus size={16} />,
      onClick: handleAddProperty,
    },
    {
      label: "Match a Request",
      icon: <LayoutList size={16} />,
      onClick: handleViewAllRequests,
    },
  ];

  return (
    <FloatingActionMenu
      trigger={trigger}
      items={addPropertyMenuItems}
      isFloating={isFloating}
      position="bottom-right"
      theme="primary"
    />
  );
};

export default AddPropertyAction;
