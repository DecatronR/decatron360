"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";

const VerificationPage = () => {
  const { contractId } = useParams();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyDocument = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/contract/verify/${contractId}`
        );
        setVerificationData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to verify document. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyDocument();
  }, [contractId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19738D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Document ID: {contractId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Document Verified
              </h2>
              <p className="text-gray-600">
                This document has been verified as authentic
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Property Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {verificationData.document.propertyName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Property Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {verificationData.document.propertyLocation}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Owner Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {verificationData.document.ownerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Client Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {verificationData.document.clientName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Signed Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(
                      new Date(verificationData.document.signedDate),
                      "MMMM d, yyyy"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {verificationData.document.status}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Document ID: {contractId}</p>
              <p className="mt-1">
                Verified on:{" "}
                {format(new Date(verificationData.timestamp), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
