import axios from "axios";

export const signOutApi = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/auth/logout`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
