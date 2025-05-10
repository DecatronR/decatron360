import axios from "axios";

export const validateSignatureLink = async ({ contractId, token, role }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Debug logging
  console.log("Validating signature link with params:", {
    contractId,
    token,
    role,
  });

  try {
    const response = await axios.get(
      `${baseUrl}/eSignature/validateSignatureLink`,
      {
        params: {
          contractId,
          token,
          role,
        },
      }
    );
    console.log("Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error validating signature link:", error);
    if (error.response) {
      console.error("Error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
    throw error;
  }
};
