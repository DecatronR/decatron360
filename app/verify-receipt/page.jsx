"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { verifyReceiptById } from "@/utils/api/manualPayment/verifyReceipt";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const VerifyReceiptPage = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchReceiptData = async () => {
      if (paymentId) {
        try {
          const res = await verifyReceiptById(paymentId);
          setPaymentData(res.data.data);
        } catch (error) {
          console.error("Error fetching receipt:", error);
          setNotFound(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setNotFound(true);
      }
    };
    fetchReceiptData();
  }, [paymentId]);

  if (isLoading) return <Spinner />;

  if (notFound)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-2">Receipt Not Found</h2>
          <p className="text-gray-600">
            Please check your QR code or payment link.
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center">
        {paymentData.status === "confirmed" ? (
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
        ) : (
          <XCircleIcon className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        )}

        <h1 className="text-3xl font-bold mb-6">
          Payment {paymentData.status === "confirmed" ? "Confirmed" : "Pending"}
        </h1>

        <div className="space-y-4 text-left text-gray-700 text-base">
          <div>
            <strong>Account Name:</strong> {paymentData.accountName}
          </div>
          <div>
            <strong>Account Number:</strong> {paymentData.accountNumber}
          </div>
          <div>
            <strong>Bank Name:</strong> {paymentData.bankName}
          </div>
          <div>
            <strong>Amount:</strong> ${paymentData.amount}
          </div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                paymentData.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : paymentData.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {paymentData.status}
            </span>
          </div>
          <div>
            <strong>Date Created:</strong>{" "}
            {new Date(paymentData.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Receipt ID: {paymentData._id}
        </div>
      </div>
    </div>
  );
};

export default VerifyReceiptPage;
