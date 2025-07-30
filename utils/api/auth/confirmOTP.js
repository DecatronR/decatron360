import axios from "axios";

export const confirmOTP = async (email, otp) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    console.log(
      "confirmOTP - Sending request to:",
      `${baseUrl}/auth/confirmOTP`
    );
    console.log("confirmOTP - Request payload:", { email, otp });

    const res = await axios.post(
      `${baseUrl}/auth/confirmOTP`,
      { email, otp },
      { withCredentials: true }
    );

    console.log("confirmOTP - Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error confirming OTP:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
