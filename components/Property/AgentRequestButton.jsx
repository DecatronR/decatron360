"use client";

import Swal from "sweetalert2";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";

const isAgent = false; // Set dynamically based on state

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
      // Add actual API call here
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

const AgentRequestButton = () => {
  return (
    <button
      type="button"
      onClick={handleSubmitRequest}
      disabled={false}
      className={`w-full py-2 px-4 rounded-md shadow-lg flex items-center justify-center font-medium transition-transform duration-300 ${
        isAgent
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
      } focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:scale-105`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <span
        className="absolute inset-0 bg-white opacity-10 rounded-md transition-opacity duration-500 hover:opacity-20"
        aria-hidden="true"
      ></span>
      {isAgent ? (
        <FaUserCheck className="mr-2 text-lg" />
      ) : (
        <FaUserPlus className="mr-2 text-lg animate-pulse" />
      )}
      <span>{isAgent ? "Stop being an agent" : "Request to be an agent"}</span>
    </button>
  );
};

export default AgentRequestButton;