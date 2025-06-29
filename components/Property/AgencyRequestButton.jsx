"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { createAgencyRequest } from "utils/api/agencyRequest/createAgencyRequest";
import { fetchPropertyAgencyStatus } from "utils/api/agencyRequest/fetchPropertyAgencyStatus";

const AgentRequestButton = ({ propertyId, ownerId }) => {
  const [agencyPropertyStatus, setAgencyPropertyStatus] = useState();
  const isAgent = false; // Set dynamically based on state

  useEffect(() => {
    const handlePropertyRequestStatus = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const res = await fetchPropertyAgencyStatus(propertyId, userId);
        console.log("property agency status: ", res);
        setAgencyPropertyStatus(res);
      } catch (error) {
        console.log("Failed to fetch property agency status", error);
      }
    };
    handlePropertyRequestStatus();
  }, []);

  const handleCreateAgencyRequest = async () => {
    const userId = sessionStorage.getItem("userId");
    const status = 0;
    try {
      const res = await createAgencyRequest(
        userId,
        propertyId,
        status,
        ownerId
      );
      console.log("agency request: ", res);
    } catch (error) {
      console.error("Failed to submit agency request: ", error);
    }
  };

  const showConfirmation = async (options) => {
    try {
      const result = await Swal.fire(options);
      return result.isConfirmed;
    } catch (error) {
      console.error("Error displaying confirmation modal:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error"
      );
      return false;
    }
  };

  const handleSubmitRequest = async () => {
    const isRequestingAgent = !isAgent;

    const modalOptions = isRequestingAgent
      ? {
          title: "Request to be an agent?",
          text: "We will share your verification status and profile with the owner of this property for approval.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, go ahead!",
          cancelButtonText: "Cancel",
        }
      : {
          title: "Quit being an agent?",
          text: "You will be removed from the agent list for this property and lose agent access.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "I agree!",
          cancelButtonText: "Cancel",
        };

    const isConfirmed = await showConfirmation(modalOptions);

    if (isConfirmed) {
      try {
        console.log("about to trigger the function");
        handleCreateAgencyRequest();
        const successMessage = isRequestingAgent
          ? "Your request to become an agent has been submitted. You will be notified via email of the owner's response."
          : "You have been successfully removed as an agent for this property.";

        Swal.fire("Success", successMessage, "success");
      } catch (error) {
        console.error("Failed to process agent request:", error);
        const errorMessage = isRequestingAgent
          ? "Failed to request to be an agent for this property."
          : "Failed to remove you as an agent for this property.";
        Swal.fire("Failed", errorMessage, "error");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubmitRequest}
      disabled={false}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
        isAgent
          ? "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
          : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md"
      }`}
    >
      {isAgent ? (
        <FaUserCheck className="mr-2 text-lg" />
      ) : (
        <FaUserPlus className="mr-2 text-lg" />
      )}
      <span>{isAgent ? "Stop being an agent" : "Request to be an agent"}</span>
    </button>
  );
};

export default AgentRequestButton;
