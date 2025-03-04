import React from "react";

const ProceedToRent = ({ onProceed, onBookInspection }) => {
  return (
    <div className="p-6 bg-yellow-50 border-l-4 border-primary-500 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">
        🚀 Ready to take the next step?
      </h2>
      <p className="text-gray-700 mt-2 text-lg">
        Secure this property now or schedule another inspection to be sure.
      </p>

      <div className="flex space-x-4 mt-6">
        <button
          className="bg-primary-500 text-white px-6 py-3 text-lg font-semibold rounded-full shadow-md 
          hover:bg-primary-600 transition duration-300 ease-in-out transform hover:scale-105 animate-pulse"
          onClick={onProceed}
        >
          Rent Now
        </button>
        <button
          className="bg-gray-200 text-gray-900 px-6 py-3 text-lg font-semibold rounded-full shadow-md 
          hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={onBookInspection}
        >
          Inspect Again
        </button>
      </div>
    </div>
  );
};

export default ProceedToRent;
