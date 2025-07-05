import { useState, useEffect } from "react";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";
import { fetchUserPaymentsByContractId } from "@/utils/api/manualPayment/fetchUserPaymentsByContractId";
import { useAuth } from "context/AuthContext";
import {
  Wallet,
  FileText,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const ContractActions = ({ contractId, handlePayment }) => {
  const { user } = useAuth();
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isWitnessDialogOpen, setIsWitnessDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUserPaymentStatus = async () => {
      try {
        setLoading(true);
        const res = await fetchUserPaymentsByContractId(contractId);
        console.log("found payment: ", res);
        const payments = res.data;

        setPaymentStatus(payments.status);
      } catch (error) {
        console.error("Error fetching user payments:", error);
        setPaymentStatus(null);
      } finally {
        setLoading(false);
      }
    };

    handleUserPaymentStatus();
  }, [contractId]);

  const isPaymentButtonDisabled =
    paymentStatus === "pending" || paymentStatus === "confirmed";
  const isActionButtonsDisabled = ["buyer", "renter"].includes(user.role)
    ? paymentStatus !== "confirmed"
    : false;

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  console.log("paymentStatus: ", paymentStatus);

  return (
    <div className="space-y-4">
      {/* Payment Status Display */}
      {["buyer", "renter"].includes(user.role) && (
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(paymentStatus)}
              <span className="text-sm font-medium text-gray-700">
                Payment Status
              </span>
            </div>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            ) : (
              <span
                className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                  paymentStatus
                )}`}
              >
                {paymentStatus
                  ? paymentStatus.charAt(0).toUpperCase() +
                    paymentStatus.slice(1)
                  : "Not Paid"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {["buyer", "renter"].includes(user.role) && (
          <button
            onClick={() => handlePayment(contractId)}
            disabled={isPaymentButtonDisabled}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              isPaymentButtonDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-[1.02]"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Make Payment</span>
          </button>
        )}

        <button
          onClick={() => setIsSignatureDialogOpen(true)}
          disabled={isActionButtonsDisabled}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            isActionButtonsDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-600 text-white shadow-lg hover:shadow-xl hover:bg-primary-700 transform hover:scale-[1.02]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sign Document</span>
        </button>

        <button
          onClick={() => setIsWitnessDialogOpen(true)}
          disabled={isActionButtonsDisabled}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${
            isActionButtonsDisabled
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
              : "border-primary-600 text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 transform hover:scale-[1.02]"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Witness</span>
        </button>
      </div>

      {/* Dialog Components */}
      <SignatureDialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
        contractId={contractId}
      />

      <WitnessInviteDialog
        open={isWitnessDialogOpen}
        onOpenChange={setIsWitnessDialogOpen}
        contractId={contractId}
      />
    </div>
  );
};

export default ContractActions;
