import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
          <FaTimesCircle className="text-red-500" />
        )}
      </div>

      {/* Phone Verification */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Phone Number</span>
        {isPhoneVerified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
      </div>

      {/* Identity Verification */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Identity</span>
        {isIdentityVerified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
      </div>
    </div>
  );
};

export default AgentVerificationStatus;
