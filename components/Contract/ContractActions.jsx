import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";
import { parseAmount } from "utils/helpers/formatCurrency";

const ContractActions = ({
  contractId,
  propertyPrice,
  cautionFee,
  agencyFee,
}) => {
  const router = useRouter();
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isWitnessDialogOpen, setIsWitnessDialogOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const handlePayment = () => {
    const propertyPriceAmount = parseAmount(propertyPrice);
    const cautionFeeAmount = parseAmount(cautionFee);
    const agencyFeeAmount = parseAmount(agencyFee);
    const total = propertyPriceAmount + cautionFeeAmount + agencyFeeAmount;

    router.push(`/manual-payment/${contractId}?amount=${total}`);
  };

  return (
    <div className="flex flex-row space-x-2 justify-between py-7">
      <button
        disabled={parseAmount(propertyPrice) === 0}
        onClick={handlePayment}
        className="px-3 py-1.5 rounded-full bg-gradient-to-r bg-green-600 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md text-sm sm:px-4 sm:py-2 sm:text-base 
    md:px-5 md:py-2.5 md:text-base"
      >
        Payment
      </button>

      <button
        onClick={() => setIsSignatureDialogOpen(true)}
        className="px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 text-sm sm:px-4 sm:py-2 sm:text-base 
    md:px-5 md:py-2.5 md:text-base "
      >
        Sign Document
      </button>

      <button
        onClick={() => setIsWitnessDialogOpen(true)}
        className="px-3 py-1.5 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50 text-sm sm:px-4 sm:py-2 sm:text-base 
    md:px-5 md:py-2.5 md:text-base "
      >
        Invite Witness
      </button>

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
