import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const UserVerificationStatus = ({
  isEmailVerified,
  isPhoneVerified,
  isIdentityVerified,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {/* Email Verification */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <span className="text-gray-700 text-sm md:text-base">Email</span>
        {isEmailVerified ? (
          <FaCheckCircle className="text-green-500 text-lg" />
        ) : (
          <button className="bg-primary-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0">
            Verify Email
          </button>
        )}
      </div>

      {/* Phone Verification */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <span className="text-gray-700 text-sm md:text-base">Phone Number</span>
        {isPhoneVerified ? (
          <FaCheckCircle className="text-green-500 text-lg" />
        ) : (
          <button className="bg-primary-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0">
            Verify Phone
          </button>
        )}
      </div>

      {/* Identity Verification */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <span className="text-gray-700 text-sm md:text-base">Identity</span>
        {isIdentityVerified ? (
          <FaCheckCircle className="text-green-500 text-lg" />
        ) : (
          <button className="bg-primary-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0">
            Verify Identity
          </button>
        )}
      </div>
    </div>
  );
};

export default UserVerificationStatus;
