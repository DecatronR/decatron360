import axios from "axios";

export const fetchAllPropertyRequests = async (params = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.get(`${baseUrl}/property-request`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all property requests:", error);
    throw error;
  }
};
