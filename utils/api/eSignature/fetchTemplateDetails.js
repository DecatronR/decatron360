import { apiClient } from "./apiClient";

/**
 * Get details of a specific template
 * @param {string} templateId - The ID of the template
 */
export const getTemplateById = async (templateId) => {
  try {
    const response = await apiClient.get(`/templates/${templateId}`);
    return response.data.template; // Returns template details
  } catch (error) {
    console.error(
      "Error fetching template details:",
      error.response?.data || error
    );
    throw error;
  }
};
