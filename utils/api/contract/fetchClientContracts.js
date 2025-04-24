import axios from "axios";

export const fetchClientContracts = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.get(`${baseUrl}/contract/clientContracts`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed fetching user (client) contracts:", error);
    throw error;
  }
};
