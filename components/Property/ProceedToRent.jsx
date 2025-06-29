import React from "react";

const ProceedToRent = ({ onProceed, onBookInspection }) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ready to proceed?
        </h3>
        <p className="text-sm text-gray-600">
          Secure this property now or schedule another inspection
        </p>
      </div>

      <div className="space-y-3">
        <button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onProceed}
        >
          Rent Now
        </button>
        <button
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 py-3 px-4 rounded-lg font-medium border border-gray-200 transition-all duration-200"
          onClick={onBookInspection}
        >
          Inspect Again
        </button>
      </div>
    </div>
  );
};

export default ProceedToRent;
