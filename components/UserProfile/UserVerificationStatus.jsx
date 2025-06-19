import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import IdentityVerificationForm from "./IdentityVerificationForm";

const UserVerificationStatus = ({
  isEmailVerified,
  isPhoneVerified,
  isIdentityVerified,
  onVerificationUpdate,
}) => {
  const [showVerificationForm, setShowVerificationForm] = useState(false);

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
            <button className="bg-primary-600 text-white px-4 py-2 rounded-full transition-colors hover:bg-primary-700">
              Verify Email
            </button>
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
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-full cursor-not-allowed"
              className="bg-gray-400 text-white px-4 py-2 rounded-full cursor-not-allowed"
            >
              Coming Soon
            </button>
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
            <button
              onClick={() => setShowVerificationForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-full transition-colors hover:bg-primary-700"
            >
              Verify Identity
            </button>
          )}
        </div>
      </div>

      {showVerificationForm && (
        <IdentityVerificationForm
          onClose={() => setShowVerificationForm(false)}
          onSuccess={() => {
            onVerificationUpdate?.();
            setShowVerificationForm(false);
          }}
        />
      )}
    </div>
  );
};

export default UserVerificationStatus;
