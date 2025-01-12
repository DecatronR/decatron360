import React from "react";

const OwnerRequests = ({ requests, onAccept, onReject }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Agent Requests
      </h2>
      <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {requests?.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b pb-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 text-base font-medium">
                {request.name}
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-transform transform hover:bg-green-600"
                  onClick={() => onAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md transition-transform transform hover:bg-red-600"
                  onClick={() => onReject(request.id)}
                >
                  Reject
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
