import axios from "axios";

export const fetchPropertyRequestsByPhone = async (phone) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.get(`${baseUrl}/propertyRequest/phone/${phone}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching property requests by phone:", error);
    throw error;
  }
};
