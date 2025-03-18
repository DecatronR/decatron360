import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Initialize a Payment Transaction
 * @param {Object} paymentData - { userId, amount, customerName, customerEmail, paymentReference, paymentDescription }
 * @returns {Promise<Object>}
 */
export const initiatePayment = async (paymentData) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const response = await axios.post(
      `${baseUrl}/payment/initiate-payment`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Payment initiation failed");
  }
};
