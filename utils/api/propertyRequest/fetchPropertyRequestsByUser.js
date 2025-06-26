import axios from "axios";

export const fetchPropertyRequestsByUser = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.get(`${baseUrl}/property-request/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching property requests by user:", error);
    throw error;
  }
};
