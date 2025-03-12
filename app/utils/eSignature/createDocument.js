"use server";
import apiClient from "./apiClient";
import qs from "qs"; // Ensure correct data encoding

/**
 * Create a document from a template (Prefill data)
 * @param {string} templateId - The ID of the Zoho Sign template
 * @param {Object} documentFields - The complete template data
 */
export const createDocumentFromTemplate = async (
  templateId,
  documentFields
) => {
  try {
    // Convert data to match Zoho's expected format
    const requestData = qs.stringify({
      data: JSON.stringify({
        templates: documentFields.templates,
      }),
      is_quicksend: "true",
    });

    const response = await apiClient.post(
      `/templates/${templateId}/createdocument`,
      requestData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.documents?.[0] || null;
  } catch (error) {
    console.error("Error creating document:", error.response?.data || error);
    throw error;
  }
};
