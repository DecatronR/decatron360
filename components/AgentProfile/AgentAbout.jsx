"use client";
import React from "react";

const AgentAbout = ({ agentData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">About {agentData?.name}</h2>
      </div>
      <p className="text-gray-700">{agentData?.bio}</p>
    </div>
  );
};

export default AgentAbout;
