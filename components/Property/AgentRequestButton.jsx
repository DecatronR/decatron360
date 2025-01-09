"use client";

import { FaUserCheck, FaUserPlus } from "react-icons/fa";

const isAgent = true;

//we'll still need to add the "pending" status when we can fetch data from the backend

const AgentRequestButton = () => {
  return (
    <button
      type="button"
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
