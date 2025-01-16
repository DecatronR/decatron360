import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StarRatings from "react-star-ratings";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import { fetchOwnerAgencyRequest } from "utils/api/agencyRequest/fetchOwnerAgencyRequests";
import { updateRequestStatus } from "utils/api/agencyRequest/updateRequestStatus";

const OwnerRequests = () => {
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

  const handleAccept = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to accept this agent as a realtor for your property ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await updateRequestStatus(id, "1"); //status 1 means accept

        Swal.fire(
          "Accepted",
          "You have accepted this agent as a realtor for your property",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Failed to accept agent as realtor for your property:",
        error
      );
      Swal.fire(
        "Failed",
        "Failed to accept agent as realtor for your property",
        "error"
      );
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to reject this agent request to be a realtor for your property.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await updateRequestStatus(id, "2"); //status 2 means decline

        Swal.fire("Deleted!", "Your property has been deleted.", "success");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      Swal.fire("Failed", "Failed to delete property!", "error");
    }
  };

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
              className="flex items-center justify-between border-b pb-1 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Link href={`/agent-profile/${request.agentId}`}>
                <div className="flex flex-col">
                  {/* Agent Name */}
                  <span className="text-gray-700 text-sm font-medium">
                    {request.agentProp.agentName}
                  </span>
                  {/* Agent Rating */}
                  <div className="mt-1">
                    <StarRatings
                      rating={request.agentProp.rating || 0}
                      starRatedColor="gold"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                      name="rating"
                    />
                  </div>
                  <span className="text-gray-500 text-xs">
                    {formatDistanceToNow(new Date(request.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
              <div className="flex space-x-3">
                {request.status === "0" ? (
                  // Show Accept and Reject buttons if the status is "0"
                  <>
                    <button
                      className="bg-green-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-green-600"
                      onClick={() => handleAccept(request.id)}
                      aria-label="Accept"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                      onClick={() => handleReject(request.id)}
                      aria-label="Reject"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </>
                ) : request.status === "1" ? (
                  // Show "Accepted" text if the status is "1"
                  <span className="text-green-600 text-xs font-semibold">
                    Accepted
                  </span>
                ) : request.status === "2" ? (
                  // Show "Rejected" text if the status is "2"
                  <span className="text-red-600 text-xs font-semibold">
                    Declined
                  </span>
                ) : (
                  //
                  <span className="text-gray-600 text-xs font-semibold">
                    Unknown Status
                  </span>
                )}
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
