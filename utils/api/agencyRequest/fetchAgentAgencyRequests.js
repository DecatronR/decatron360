import axios from "axios";

export const fetchAgentAgencyRequest = async (requestAgentId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/agencyRequest/agentRequest`,
      { requestAgentId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch agent's agency request:", error);
    throw error;
  }
};