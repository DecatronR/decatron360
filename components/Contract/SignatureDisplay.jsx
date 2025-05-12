import React, { useEffect, useState } from "react";
import { fetchSignedRoles } from "utils/api/eSignature/fetchSignedRoles";
import { fetchSignatureByContractId } from "utils/api/eSignature/fetchSignatureByContractId";

const SignatureDisplay = ({ contractId }) => {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSignatures = async () => {
      try {
        setLoading(true);
        // Fetch signed roles
        const rolesResponse = await fetchSignedRoles(contractId);
        const signedRoles = rolesResponse.data || [];

        // Fetch signature images for each role
        const signaturesResponse = await fetchSignatureByContractId(contractId);
        const signatureData = signaturesResponse.data || [];

        // Combine role and signature data
        const combinedData = signedRoles.map((role) => {
          const signature = signatureData.find((sig) => sig.role === role);
          return {
            role,
            signatureImage: signature?.signatureImage,
            timestamp: signature?.timestamp,
            signerName: signature?.signerName || getDefaultSignerName(role),
          };
        });

        setSignatures(combinedData);
        setError(null);
      } catch (err) {
        setError("Failed to load signatures");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      loadSignatures();
    }
  }, [contractId]);

  const getDefaultSignerName = (role) => {
    switch (role) {
      case "propertyOwner":
        return "Property Owner";
      case "tenant":
        return "Tenant";
      case "propertyOwnerWitness":
        return "Owner's Witness";
      case "tenantWitness":
        return "Tenant's Witness";
      default:
        return role;
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading signatures...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (signatures.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Signatures</h3>
      <div className="grid grid-cols-2 gap-6">
        {signatures.map((sig) => (
          <div key={sig.role} className="flex flex-col items-center">
            {sig.signatureImage ? (
              <img
                src={sig.signatureImage}
                alt={`${sig.signerName}'s signature`}
                className="w-48 h-24 object-contain mb-2"
              />
            ) : (
              <div className="w-48 h-24 border-b-2 border-gray-300 mb-2" />
            )}
            <div className="text-center">
              <p className="font-medium text-gray-700">{sig.signerName}</p>
              <p className="text-sm text-gray-500">
                {new Date(sig.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatureDisplay;
