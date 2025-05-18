"use client";
import React from "react";
import { MoonLoader } from "react-spinners";

const MoonSpinner = ({ loading, message = "Loading, please wait..." }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-transparent">
      <MoonLoader
        color="#ffffff"
        loading={loading}
        size={80}
        speedMultiplier={0.8}
        cssOverride={{
          display: "block",
          margin: "0 auto",
        }}
      />
      {loading && (
        <p
          className="mt-6 text-xl text-white font-semibold animate-pulse"
          style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default MoonSpinner;
