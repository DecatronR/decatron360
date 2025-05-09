import { useState } from "react";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";

const ContractActions = ({ contractId }) => {
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isWitnessDialogOpen, setIsWitnessDialogOpen] = useState(false);

  const handleSignatureSave = (signatureUrl) => {
    // Handle the saved signature
    console.log("Signature saved:", signatureUrl);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setIsSignatureDialogOpen(true)}
        className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700"
      >
        Sign Document
      </button>

      <button
        onClick={() => setIsWitnessDialogOpen(true)}
        className="px-4 py-2 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50"
      >
        Invite Witness
      </button>

      <SignatureDialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
        onSave={handleSignatureSave}
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
