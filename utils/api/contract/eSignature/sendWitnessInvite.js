import axios from "axios";

export const sendWitnessInvite = async (
  contractId,
  witnessName,
  witnessEmail,
  role
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/eSignature/sendWitnessInvite`,
      {
        contractId,
        witnessName,
        witnessEmail,
        role,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to send invite to witness:", error);
    throw error;
  }
};
