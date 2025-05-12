import React from "react";
import { CheckCircle } from "lucide-react";

const SignatureProgress = ({ signedCount, totalCount }) => {
  const percentage = (signedCount / totalCount) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="text-primary-600 transition-all duration-500 ease-in-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {signedCount}/{totalCount}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-700">Signatures</h3>
        <p className="text-xs text-gray-500">
          {signedCount === totalCount ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              All signed
            </span>
          ) : (
            `${signedCount} of ${totalCount} completed`
          )}
        </p>
      </div>
    </div>
  );
};

export default SignatureProgress;
