import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { fetchAgentAgencyRequest } from "utils/api/agencyRequest/fetchAgentAgencyRequests";

const AgentRequests = ({ requests, onCancel }) => {
  //   const [requests, setRequests] = useState([]);

  useEffect(() => {
    const handleFetchAgencyRequest = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const res = await fetchAgentAgencyRequest(userId);
        console.log("Agency requests for agent: ", res);
      } catch (error) {
        console.log("Failed to fetch agent's agency requests");
      }
    };
    handleFetchAgencyRequest();
  }, []);

  //map through it to render the property name and location
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Requests</h2>
      <div className="space-y-2 p-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {requests?.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b pb-1 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  {request.propertyName}
                </span>
                <span className="text-gray-500 text-xs italic">Pending</span>
              </div>
              <button
                className="bg-red-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                onClick={() => onReject(request.id)}
                aria-label="Reject"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AgentRequests;
