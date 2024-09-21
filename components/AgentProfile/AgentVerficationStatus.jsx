import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const AgentVerificationStatus = ({
  isEmailVerified,
  isPhoneVerified,
  isIdentityVerified,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {/* Email Verification */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Email</span>
        {isEmailVerified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Verify Email
          </button>
        )}
      </div>

      {/* Phone Verification */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Phone Number</span>
        {isPhoneVerified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Verify Phone
          </button>
        )}
      </div>

      {/* Identity Verification */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Identity</span>
        {isIdentityVerified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Verify Identity
          </button>
        )}
      </div>
    </div>
  );
};

export default AgentVerificationStatus;
