import React, { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { fetchOwnerAgencyRequest } from "utils/api/agencyRequest/fetchOwnerAgencyRequests";
import StarRatings from "react-star-ratings";

const OwnerRequests = ({ onAccept, onReject }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const handleFetchAgencyRequest = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const res = await fetchOwnerAgencyRequest(userId);
        setRequests(res);
        console.log("Owner requests for agent: ", res);
      } catch (error) {
        console.log("Failed to fetch agent's agency requests");
      }
    };
    handleFetchAgencyRequest();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Agent Requests
      </h2>
      <div className="space-y-2 p-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {requests?.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b pb-1 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col">
                {/* Agent Name */}
                <span className="text-gray-700 text-sm font-medium">
                  {request.agentProp.agentName}
                </span>
                {/* Agent Rating */}
                <div className="mt-1">
                  <StarRatings
                    rating={request.agentProp.rating || 0} // Dynamically fetch rating
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  className="bg-green-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-green-600"
                  onClick={() => onAccept(request.id)}
                  aria-label="Accept"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                  onClick={() => onReject(request.id)}
                  aria-label="Reject"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No requests available.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerRequests;
