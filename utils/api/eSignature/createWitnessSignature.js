import axios from "axios";

export const createWitnessSignature = async (signatureData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const signingToken = signatureData.get("signingToken");

  if (!signingToken) {
    console.error("No signing token provided");
    throw new Error("No signing token provided");
  }

  // Log all form data entries
  console.log("Form Data contents:");
  for (let [key, value] of signatureData.entries()) {
    if (key === "signatureImage") {
      console.log(`${key}: [File object]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  try {
    console.log("Making request to:", `${baseUrl}/eSignature/create`);
    const res = await axios.post(
      `${baseUrl}/eSignature/create`,
      signatureData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response received:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to create witness signature:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    if (error.response?.data) {
      throw new Error(
        error.response.data.responseMessage || "Failed to save signature"
      );
    }
    throw error;
  }
};
