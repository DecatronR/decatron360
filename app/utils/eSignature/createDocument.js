"use server";
import apiClient from "./apiClient";

/**
 * Create a document from a template (Prefill data)
 * @param {string} templateId - The ID of the Zoho Sign template
 * @param {Object} fieldData - An object containing prefilled field values
 */
export const createDocumentFromTemplate = async (templateId, fieldData) => {
  try {
    const response = await apiClient.post(
      `/templates/${templateId}/createdocument`,
      {
        requests: [
          {
            field_data: { fields: fieldData },
          },
        ],
      }
    );
    return response.data.documents[0]; // Returns created document details
  } catch (error) {
    console.error("Error creating document:", error.response?.data || error);
    throw error;
  }
};
