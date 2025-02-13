import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { fetchAgentAgencyRequest } from "utils/api/agencyRequest/fetchAgentAgencyRequests";
import { truncateText } from "utils/helpers/truncateText";
import { deleteAgencyRequest } from "utils/api/agencyRequest/deleteAgencyRequest";

const AgentRequests = ({ onCancel }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const handleFetchAgencyRequest = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const res = await fetchAgentAgencyRequest(userId);

        //filtered out declined request from list
        const filteredRequests = res.filter((request) => request.status != "2");
        setRequests(filteredRequests);
        console.log("Agency requests for agent: ", res);
      } catch (error) {
        console.log("Failed to fetch agent's agency requests");
      }
    };
    handleFetchAgencyRequest();
  }, []);

  const handleCancelRequest = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want cancel you request to be an agent for this property.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteAgencyRequest(id);
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== id)
        );
        Swal.fire("Deleted!", "Your property has been deleted.", "success");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      Swal.fire("Failed", "Failed to delete property!", "error");
    }
  };

  const mapStatus = (status) => {
    switch (status) {
      case "0":
        return { text: "Pending", color: "text-yellow-600" };
      case "1":
        return { text: "Accepted", color: "text-green-600" };
      case "2":
        return { text: "Declined", color: "text-red-600" };
      default:
        return { text: "Unknown Status", color: "text-gray-500" };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Requests</h2>
      <div className="space-y-2 p-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {requests?.length > 0 ? (
          requests.map((request) => {
            const statusInfo = mapStatus(request.status);
            return (
              <div
                key={request.id}
                className="flex items-center justify-between border-b pb-1 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Link href={`/properties/${request.propertyListingId}`}>
                  <div className="flex flex-col">
                    {/* Property Name */}
                    <span className="text-gray-700 text-sm font-medium">
                      {truncateText(request.agentProp.propertyName, 30)}
                    </span>
                    {/* Property Location */}
                    <span className="text-gray-500 text-xs">
                      Location: {truncateText(request.agentProp.location, 30)}
                    </span>
                    {/* Request Status */}
                    <span
                      className={`text-xs font-semibold ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </Link>
                {(request.status === "0" || request.status === "2") && ( // only display delete request button when the request has not been accepted
                  <button
                    className="bg-red-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                    onClick={() => handleCancelRequest(request.id)}
                    aria-label="Cancel"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No requests found.</p>
        )}
      </div>
    </div>
  );
};

export default AgentRequests;
