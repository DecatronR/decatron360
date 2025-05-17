"use client";
import React, { useState, useEffect } from "react";
import { Copy, Banknote, ShieldCheck, Send } from "lucide-react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import MoonSpinner from "@/components/ui/MoonSpinner";
import { createManualPayment } from "utils/api/manualPayment/createManualPayment";
import socket from "@/lib/socket";
import { getPaymentById } from "utils/api/manualPayment/getPaymentById";

const bankDetails = {
  accountName: "Decatron Realtors",
  accountNumber: "1016383350",
  bankName: "Zenith Bank PLC",
};

const ManualPaymentPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const contractId = "12389hiy9894";
  const amount = 4000000;
  const [paymentId, setPaymentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(
    "We are confirming your payment..."
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied to clipboard!", { variant: "success" });
  };

  useEffect(() => {
    const existingPaymentId = localStorage.getItem("paymentId");
    if (existingPaymentId) {
      setPaymentId(existingPaymentId);
      setIsProcessing(true);
      handleFetchPaymentStatus(existingPaymentId);
    }
  }, []);

  const handleFetchPaymentStatus = async (paymentId) => {
    try {
      const res = await getPaymentById(paymentId);
      const status = res.data.status;

      setPaymentStatus(status);

      if (status === "confirmed") {
        Swal.fire({
          icon: "success",
          title: "Payment Confirmed!",
          text: "...",
        }).then(() => {
          localStorage.removeItem("paymentId");
          router.push("/confirmation");
        });
        setIsProcessing(false);
      } else if (status === "failed") {
        Swal.fire({ icon: "error", title: "Payment Failed!", text: "..." });
        setIsProcessing(false);
      } else {
        // Pending - wait for socket update
      }
    } catch (error) {
      console.error("Failed to fetch payment status", error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!paymentId) return;

    console.log("Joining room with paymentId", paymentId);

    socket.emit("joinPaymentRoom", { contractId, paymentId });

    const handlePaymentStatusChanged = (data) => {
      console.log("Received paymentStatusChanged event:", data);

      if (data.contractId === contractId && data.paymentId === paymentId) {
        setPaymentStatus(data.status);

        if (data.status === "confirmed") {
          Swal.fire({
            icon: "success",
            title: "Payment Confirmed!",
            text: "Your payment was successful. You will be redirected shortly.",
          }).then(() => {
            localStorage.removeItem("paymentId");
            router.push("/confirmation");
          });
        } else if (data.status === "failed") {
          Swal.fire({
            icon: "error",
            title: "Payment Failed!",
            text: "Your payment failed. Please try again or contact support.",
          });
        }

        setIsProcessing(false);
      }
    };

    socket.on("paymentStatusChanged", handlePaymentStatusChanged);

    // Cleanup
    return () => {
      socket.emit("leaveRoom", { contractId, paymentId });
      socket.off("paymentStatusChanged", handlePaymentStatusChanged);
    };
  }, [paymentId]);

  const handlePaymentConfirmation = async () => {
    setIsProcessing(true);
    setPaymentStatus(null);
    setLoadingMessage("We are confirming your payment...");

    try {
      const paymentConfirmed = await createManualPayment(
        contractId,
        bankDetails.accountName,
        bankDetails.accountNumber,
        bankDetails.bankName,
        amount
      );

      console.log(paymentConfirmed);

      if (paymentConfirmed.responseCode === 201) {
        const newPaymentId = paymentConfirmed.data._id;
        console.log(newPaymentId);
        setPaymentId(newPaymentId);
        localStorage.setItem("paymentId", newPaymentId);

        // Join the WebSocket room for the new paymentId
        socket.emit("joinPaymentRoom", { contractId, paymentId: newPaymentId });

        // Show spinner, wait for websocket event — no Swal here yet
        setLoadingMessage("Waiting for payment confirmation...");
      } else {
        setPaymentStatus("error");
        setLoadingMessage(
          "There was an error initiating your payment. Please try again."
        );
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus("error");
      setLoadingMessage("There was an error processing your payment.");
      setIsProcessing(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 relative">
      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <MoonSpinner loading={isProcessing} message={loadingMessage} />
        </div>
      )}

      {/* Main Content */}
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Complete Your Payment
      </h2>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Banknote className="w-7 h-7 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Bank Details</h2>
        </div>

        {/* Bank Details */}
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

        {/* Amount to Pay */}
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-lg font-medium text-gray-800">
              ₦{amount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(amount.toString())}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <Copy className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Important Note */}
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-800 text-sm">
          <ShieldCheck className="w-4 h-4 inline-block mr-2 text-yellow-600" />
          Please ensure you send the <strong>exact amount displayed</strong>.
          Incorrect payments may delay your confirmation.
        </div>

        {/* Payment Confirmation Button */}
        <button
          onClick={handlePaymentConfirmation}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold rounded-full transition"
        >
          <Send className="w-5 h-5" /> I have sent the money
        </button>

        {/* Payment Status */}
        {paymentStatus === "success" && (
          <div className="text-green-600 mt-4">
            Payment confirmed! Thank you.
          </div>
        )}
        {paymentStatus === "error" && (
          <div className="text-red-600 mt-4">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </section>
  );
};

export default ManualPaymentPage;
