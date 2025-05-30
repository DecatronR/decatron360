import axios from "axios";

export const createAgencyRequest = async (
  agentId,
  propertyListingId,
  status,
  ownerId
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/agencyRequest/create`,
      { agentId, propertyListingId, status, ownerId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to create agency request:", error);
    throw error;
  }
};
