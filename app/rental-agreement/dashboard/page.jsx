"use client";
import React, { useState } from "react";
import TemplateWrapper from "components/RentalAgreement/TemplateWrapper";

const contractStages = [
  { label: "Draft", color: "#28a745" },
  { label: "Under Review", color: "#007bff" },
  { label: "Modification Requested", color: "#ffc107" },
  { label: "Owner Review", color: "#fd7e14" },
  { label: "Awaiting Signature", color: "#dc3545" },
  { label: "Completed", color: "#218838" },
];

const Dashboard = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // Track messages

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments([...comments, { text: comment, timestamp: new Date() }]);
      setComment("");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          Rental Agreement Dashboard
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 relative flex flex-col transition-all duration-500">
        {/* Progress Tracker */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Your Rental Agreement
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Track the progress of your rental agreement seamlessly.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-between mt-6 gap-2 sm:gap-0">
            {contractStages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  style={{ backgroundColor: stage.color }}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-opacity duration-300 ${
                    currentStage >= index ? "opacity-100" : "opacity-50"
                  }`}
                ></div>
                <span className="mt-2 text-xs sm:text-sm text-gray-700 text-center">
                  {stage.label}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(currentStage / (contractStages.length - 1)) * 100}%`,
                backgroundColor: contractStages[currentStage].color,
              }}
            ></div>
          </div>
        </div>

        {/* Main Content - Template & Comment Box */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          {/* Template Wrapper - Stays Within Layout */}
          <div
            className={`w-full lg:${
              showCommentBox ? "w-2/3" : "w-full"
            } min-h-[300px]`}
          >
            <TemplateWrapper />
          </div>

          {/* Comment Box - Responsive behavior */}
          {showCommentBox && (
            <div className="w-full lg:w-1/3 bg-gray-100 shadow-md rounded-md p-4 flex flex-col max-h-[1000px]">
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
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
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
