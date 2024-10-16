import axios from "axios";

export const fetchRoles = async () => {
  const baseUrl = process.env.BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/role/getRoles`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};
