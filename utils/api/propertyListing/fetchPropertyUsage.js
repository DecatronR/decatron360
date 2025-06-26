import axios from "axios";

export const fetchPropertyUsage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(`${baseUrl}/propertyUsage/fetchPropertyUsage`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching property usage:", error);
    throw error;
  }
};
