"use server ";
import apiClient from "./apiClient";

/**
 *Send the document for signing
 * @param {string} documentId - The ID of the document created from a template
 * @param {Array} signers - List of signers with name and email
 */
export const sendDocumentForSigning = async (documentId, signers) => {
  try {
    const actions = signers.map((signer) => ({
      recipient_name: signer.name,
      recipient_email: signer.email,
      action_type: "SIGN",
    }));

    const response = await apiClient.post("/requests", {
      requests: [
        {
          request_name: "Real Estate Agreement",
          actions,
          document_ids: [documentId],
        },
      ],
    });

    return response.data.requests[0]; // Returns signing request details
  } catch (error) {
    console.error(
      "Error sending document for signing:",
      error.response?.data || error
    );
    throw error;
  }
};
