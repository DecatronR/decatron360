import axios from "axios";

export const fetchUserPaymentsByContractId = async (contractId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/manualPayment/getUserPaymentByContract`,
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
    console.error("Failed to get user payments by contract id:", error);
    throw error;
  }
};
