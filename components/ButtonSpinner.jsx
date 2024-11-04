"use client";
import { ClipLoader } from "react-spinners";

const ButtonSpinner = ({ loading }) => {
  return (
    <div className="flex items-center justify-center">
      <ClipLoader
        color="#5a47fb"
        loading={loading}
        size={20}
        aria-label="Loading Spinner"
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderWidth: "3px",
          transition: "transform 0.3s ease",
        }}
      />
      {loading && (
        <p className="ml-2 text-sm text-gray-700">Loading, please wait...</p>
      )}
    </div>
  );
};

export default ButtonSpinner;
