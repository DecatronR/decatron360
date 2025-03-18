const API_BASE_URL = process.env.NEXT_PUBLIC_DOMAIN;

/**
 * Verify Payment Transaction
 * @param {string} paymentReference
 * @returns {Promise<Object>}
 */
export const verifyPayment = async (paymentReference) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/verify-payment/${paymentReference}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error.response?.data || error);
    throw new Error(
      error.response?.data?.error || "Payment verification failed"
    );
  }
};
