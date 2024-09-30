"use client";

import ClipLoader from "react-spinners/ClipLoader";

const LoadingPage = ({ loading }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <ClipLoader
        color="#5a47fb"
        loading={loading}
        size={100}
        aria-label="Loading Spinner"
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderWidth: "3px",
          transition: "transform 0.3s ease",
        }}
      />
      {loading && (
        <p className="mt-4 text-xl text-gray-600 font-semibold">
          Loading, please wait...
        </p>
      )}
    </div>
  );
};

export default LoadingPage;
