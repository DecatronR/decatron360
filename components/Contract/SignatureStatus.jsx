import React, { useEffect, useState } from "react";
import { fetchSignedRoles } from "@/utils/api/eSignature/fetchSignedRoles";
import { CheckCircle, XCircle } from "lucide-react";
import SignatureProgress from "./SignatureProgress";

const SignatureStatus = ({ contractId }) => {
  const [signedRoles, setSignedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allRoles = [
    "propertyOwner",
    "tenant",
    "propertyOwnerWitness",
    "tenantWitness",
  ];

  useEffect(() => {
    const loadSignedRoles = async () => {
      try {
        setLoading(true);
        const response = await fetchSignedRoles(contractId);
        setSignedRoles(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load signature status");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      loadSignedRoles();
    }
  }, [contractId]);

  if (loading) {
    return <div className="animate-pulse">Loading signature status...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const getRoleLabel = (role) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Signature Status</h3>
        <SignatureProgress
          signedCount={signedRoles.length}
          totalCount={allRoles.length}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {allRoles.map((role) => {
          const isSigned = signedRoles.includes(role);
          return (
            <div
              key={role}
              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors duration-200 ${
                isSigned
                  ? "border-green-100 bg-green-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              {isSigned ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-700">
                {getRoleLabel(role)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SignatureStatus;
