"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateWrapper from "components/RentalAgreement/TemplateWrapper";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";

const contractStages = [
  { label: "Draft", color: "#28a745" },
  { label: "Under Review", color: "#007bff" },
  { label: "Modification Requested", color: "#ffc107" },
  { label: "Owner Review", color: "#fd7e14" },
  { label: "Awaiting Signature", color: "#dc3545" },
  { label: "Completed", color: "#218838" },
];

const Dashboard = () => {
  const { id } = useParams();
  const [currentStage, setCurrentStage] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [propertyData, setPropertyData] = useState({});
  const [ownerId, setOwnerId] = useState(null);
  const [ownerData, setOwnerData] = useState({});
  const [tenantData, setTenantData] = useState({});

  const toggleCommentBox = () => setShowCommentBox(!showCommentBox);

  const handleCommentChange = (event) => setComment(event.target.value);

  useEffect(() => {
    const handleFetchPropertyData = async () => {
      try {
        const res = await fetchPropertyData(id);
        setPropertyData(res);
        setOwnerId(res.data.userID);
        console.log("property data: ", res);
      } catch (error) {
        console.log("Failed to fetch property data: ", error);
      }
    };

    if (id) handleFetchPropertyData();
  }, [id]);

  useEffect(() => {
    const handleFetchOwnerData = async () => {
      try {
        if (!ownerId) return;
        const res = await fetchUserData(ownerId);
        setOwnerData(res);
        console.log("owner data: ", res);
      } catch (error) {
        console.log("Failed to fetch owner data: ", error);
      }
    };

    handleFetchOwnerData();
  }, [ownerId]);

  useEffect(() => {
    const handleFetchTenantData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await fetchUserData(userId);
        setTenantData(res);
      } catch (error) {
        console.log("Failed to fetch user | tenant data:", error);
      }
    };

    handleFetchTenantData();
  }, []);

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments([...comments, { text: comment, timestamp: new Date() }]);
      setComment("");
    }
  };

  return (
    <div className="py-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="px-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Rental Agreement Dashboard
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-0 sm:p-6 relative flex flex-col transition-all duration-500">
        {/* Main Content - Template & Comment Box */}
        <div className="flex flex-col lg:flex-row gap-4 mt-0 sm:mt-6">
          <div
            className={`w-full lg:${
              showCommentBox ? "w-2/3" : "w-full"
            } min-h-[300px]`}
          >
            <TemplateWrapper />
          </div>

          {showCommentBox && (
            <div className="w-full lg:w-1/3 bg-gray-100 shadow-md rounded-md p-4 sm:p-6 flex flex-col max-h-[1000px]">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Modification Requests
              </h3>
              <div className="flex-1 overflow-y-auto max-h-[700px] space-y-2 border p-2 rounded-md bg-white">
                {comments.length > 0 ? (
                  comments.map((msg, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 p-2 rounded-md text-gray-700 text-sm"
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No messages yet.</p>
                )}
              </div>
              <textarea
                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                rows={2}
                placeholder="Describe the required modifications..."
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
              <button
                onClick={handleSubmitComment}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-6 py-4 sm:py-4">
          <button className="px-6 py-2 w-full sm:w-auto bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            Proceed to Sign
          </button>
          <button
            onClick={toggleCommentBox}
            className="px-6 py-2 w-full sm:w-auto bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
          >
            Request Modification
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
