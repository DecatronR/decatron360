import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const OwnerRequests = ({ requests, onAccept, onReject }) => {
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
              <span className="text-gray-700 text-sm font-medium">
                {request.name}
              </span>
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
