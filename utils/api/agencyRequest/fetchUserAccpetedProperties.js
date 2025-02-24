import axios from "axios";

export const fetchUserAcceptedProperties = async (agentId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!userId) {
    throw new Error("User ID is required to fetch accepted properties");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/agencyRequest/getAcceptedProperties`,
      { agentId: agentId },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Issue fetching user accepted properties:", error);
    throw error;
  }
};
