import { useState, useEffect } from "react";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";
import { fetchUserPaymentsByContractId } from "@/utils/api/manualPayment/fetchUserPaymentsByContractId";
import { useAuth } from "context/AuthContext";
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

  console.log("paymentStatus: ", paymentStatus);

  return (
    <div className="flex flex-col space-y-3">
      {/* Payment Status Display */}
      {["buyer", "renter"].includes(user.role) && (
        <div>
          {loading ? (
            <p className="text-sm text-gray-500">Fetching payment status...</p>
          ) : (
            <p className="text-sm text-gray-600">
              {paymentStatus
                ? `Payment Status: ${paymentStatus}`
                : "No payment record found."}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-row space-x-2 justify-between py-3">
        {["buyer", "renter"].includes(user.role) && (
          <button
            onClick={() => handlePayment(contractId)}
            disabled={isPaymentButtonDisabled}
            className={`px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5 md:text-base transition ${
              isPaymentButtonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-emerald-600 hover:to-emerald-700"
            }`}
          >
            Payment
          </button>
        )}

        <button
          onClick={() => setIsSignatureDialogOpen(true)}
          disabled={isActionButtonsDisabled}
          className={`px-3 py-1.5 rounded-full bg-primary-600 text-white text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5 md:text-base transition ${
            isActionButtonsDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary-700"
          }`}
        >
          Sign Document
        </button>

        <button
          onClick={() => setIsWitnessDialogOpen(true)}
          disabled={isActionButtonsDisabled}
          className={`px-3 py-1.5 rounded-full border border-primary-600 text-primary-600 text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5 md:text-base transition ${
            isActionButtonsDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary-50"
          }`}
        >
          Invite Witness
        </button>

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
    </div>
  );
};

export default ContractActions;
