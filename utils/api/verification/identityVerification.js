import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const identityVerification = async (userId, verificationData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(
      `${baseUrl}/users/verifyNIN`,
      {
        id: userId,
        nin: verificationData.nin,
        firstname: verificationData.firstname,
        lastname: verificationData.lastname,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying identity:", error);
    throw error;
  }
};
