import axios from "axios";

export const fetchPropertyAgencyStatus = async (propertyListingId, agentId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/agencyRequest//agencyPropertyStatus`,
      { propertyListingId, agentId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch property agency status:", error);
    throw error;
  }
};
