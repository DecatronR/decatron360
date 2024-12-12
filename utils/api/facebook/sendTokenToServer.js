import axios from "axios";

export const sendTokenToServer = async (longLivedToken) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await axios.post(`${baseUrl}/facebook/set-token`, {
      longLivedToken,
    });
    console.log("Token sent and stored successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending token to server:",
      error.response?.data || error.message
    );
  }
};
