import axios from "axios";

export const resendOTP = async (email) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/auth/resendOTP`,
      { email },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};
