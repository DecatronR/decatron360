import axios from "axios";

export const createPropertyRequest = async (data) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.post(`${baseUrl}/property-request`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating property request:", error);
    throw error;
  }
};
