import axios from "axios";

export const fetchSignedRoles = async (contractId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/eSignature/fetchSignedRoles`,
      {
        contractId,
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
    console.error(
      "Failed to fetch signers status contract's e-signature:",
      error
    );
    throw error;
  }
};
