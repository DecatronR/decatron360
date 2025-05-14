"use client";
import React from "react";
import { Copy, Banknote, ShieldCheck, Send } from "lucide-react";
import { useSnackbar } from "notistack";

const bankDetails = {
  accountName: "Decatron Realtors",
  accountNumber: "1016383350",
  bankName: "Zenith Bank PLC",
};

const ManualPaymentPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied to clipboard!", { variant: "success" });
  };

  const handlePaymentConfirmation = () => {
    enqueueSnackbar("Thanks! We've received your notification.", {
      variant: "info",
    });
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Complete Your Payment
      </h1>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Banknote className="w-7 h-7 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Bank Details</h2>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {Object.entries(bankDetails).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="text-sm text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-lg font-medium text-gray-800">{value}</p>
              </div>
              <button
                onClick={() => copyToClipboard(value)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>

        {/* Payment Confirmation Button */}
        <button
          onClick={handlePaymentConfirmation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold rounded-full transition"
        >
          <Send className="w-5 h-5" />I have sent the money
        </button>
      </div>
    </section>
  );
};

export default ManualPaymentPage;
