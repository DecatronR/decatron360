import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN;

/**
 * Initialize a Payment Transaction
 * @param {Object} paymentData - { amount, customerName, customerEmail, paymentReference, paymentDescription }
 * @returns {Promise<Object>}
 */
export const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/initiate-payment`,
      paymentData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Payment initiation failed");
  }
};
