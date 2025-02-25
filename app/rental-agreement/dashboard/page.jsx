"use client";
import React, { useState } from "react";
import TemplateWrapper from "components/RentalAgreement/TemplateWrapper";

const contractStages = [
  { label: "Draft", color: "#28a745" },
  { label: "Under Review", color: "#007bff" },
  { label: "Modification Requested", color: "#ffc107" },
  { label: "Owner Review", color: "#fd7e14" },
  { label: "Finalizing", color: "#6f42c1" },
  { label: "Awaiting Signature", color: "#dc3545" },
  { label: "Completed", color: "#218838" },
];

const Dashboard = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const progressPercentage = (currentStage / (contractStages.length - 1)) * 100;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Rental Agreement Dashboard
        </h1>
      </header>

      {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Your Rental Agreement
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Track the progress of your rental agreement seamlessly.
        </p>

        {/* Progress Indicators */}
        <div className="flex items-center justify-between mt-6">
          {contractStages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                style={{ backgroundColor: stage.color }}
                className={`w-8 h-8 rounded-full transition-opacity duration-300 ${
                  currentStage >= index ? "opacity-100" : "opacity-50"
                }`}
              ></div>
              <span className="mt-2 text-xs text-gray-700 text-center">
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: contractStages[currentStage].color,
            }}
          ></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {/* <button
            onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
            disabled={currentStage === 0}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
              currentStage === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }`}
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentStage(
                Math.min(contractStages.length - 1, currentStage + 1)
              )
            }
            disabled={currentStage === contractStages.length - 1}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
              currentStage === contractStages.length - 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }`}
          >
            Next
          </button> */}
        </div>
        <div>
          <TemplateWrapper />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
