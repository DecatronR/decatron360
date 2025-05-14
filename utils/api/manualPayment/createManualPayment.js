import axios from "axios";

export const createManualPayment = async (
  contractId,
  accountName,
  accountNumber,
  bankName,
  amount
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/manualPayment/create`,
      {
        contractId,
        accountName,
        accountNumber,
        bankName,
        amount,
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
    console.error("Failed to create manual payment intent:", error);
    throw error;
  }
};
