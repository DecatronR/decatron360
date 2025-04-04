import axios from "axios";

export const trackVisitor = async (ip, userAgent) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await axios.post(
      `${baseUrl}/track`,
      { ip, userAgent },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to book inspection:", error);
    throw error;
  }
};
