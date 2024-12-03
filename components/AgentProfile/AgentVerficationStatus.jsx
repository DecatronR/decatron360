import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const AgentVerificationStatus = ({
  isEmailVerified,
  isPhoneVerified,
  isIdentityVerified,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Verification Status
      </h2>
      <div className="space-y-4">
        {/* Email Verification */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-700 text-base">Email</span>
          {isEmailVerified ? (
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-lg mr-2" />
              <span className="text-green-600 text-sm">Verified</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Unverified</span>
          )}
        </div>

        {/* Phone Verification */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-700 text-base">Phone Number</span>
          {isPhoneVerified ? (
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-lg mr-2" />
              <span className="text-green-600 text-sm">Verified</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Unverified</span>
          )}
        </div>

        {/* Identity Verification */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-base">Identity</span>
          {isIdentityVerified ? (
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-lg mr-2" />
              <span className="text-green-600 text-sm">Verified</span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Unverified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentVerificationStatus;
