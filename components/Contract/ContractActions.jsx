import { useState } from "react";
import { useAuth } from "context/AuthContext";
import SignatureDialog from "./SignatureDialogue";
import WitnessInviteDialog from "./WitnessInviteDialog";

const ContractActions = ({ contractId }) => {
  const { user } = useAuth();
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showWitnessDialog, setShowWitnessDialog] = useState(false);

  const handleSignatureSave = (signatureUrl) => {
    // Handle signature save if needed
    console.log("Signature saved:", signatureUrl);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow">
      <button
        onClick={() => setShowSignatureDialog(true)}
        className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Sign Contract
      </button>
      <button
        onClick={() => setShowWitnessDialog(true)}
        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Invite Witness
      </button>

      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onSave={handleSignatureSave}
        contractId={contractId}
      />

      <WitnessInviteDialog
        open={showWitnessDialog}
        onOpenChange={setShowWitnessDialog}
        contractId={contractId}
      />
    </div>
  );
};

export default ContractActions;
