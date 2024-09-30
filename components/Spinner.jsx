"use client";
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ loading }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ClipLoader
        color="#5a47fb"
        loading={loading}
        size={60}
        aria-label="Loading Spinner"
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderWidth: "3px",
          transition: "transform 0.3s ease",
        }}
      />
      {loading && (
        <p className="mt-4 text-lg text-gray-700">Loading, please wait...</p>
      )}
    </div>
  );
};

export default Spinner;
