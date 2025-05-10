"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SignatureDialog from "components/Contract/SignatureDialogue";
import { validateSignatureLink } from "utils/api/eSignature/validateSignatureLink";

const WitnessSigningPage = () => {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (!contractId || !token || !role) {
        console.log("Missing required parameters:", {
          contractId,
          token,
          role,
        });
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        const response = await validateSignatureLink({
          contractId,
          token,
          role,
        });
        console.log("Validation response:", response);
        setIsValidToken(response.isValid);
      } catch (error) {
        console.error("Token validation failed:", error);
        setError(
          "Invalid or expired signing link. Please request a new invitation."
        );
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [contractId, token, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating your signing link...</p>
        </div>
      </div>
    );
  }

  if (error || !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">Invalid Signing Link</h1>
          <p className="text-gray-600">
            {error ||
              "This signing link is invalid or has expired. Please request a new invitation."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">
            Sign Contract as Witness
          </h1>
          <SignatureDialog
            open={true}
            onOpenChange={() => {
              // Handle completion - maybe redirect to a thank you page
              window.location.href = "/thank-you";
            }}
            contractId={contractId}
            role={role}
            isGuest={true}
            signingToken={token}
          />
        </div>
      </div>
    </div>
  );
};

export default WitnessSigningPage;
