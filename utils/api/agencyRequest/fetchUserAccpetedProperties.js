import axios from "axios";

export const fetchUserAcceptedProperties = async (agentId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");

  if (!agentId) {
    throw new Error("User ID is required to fetch accepted properties");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/agencyRequest/getAcceptedProperties`,
      { agentId: agentId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Accepted properties: ", res.data);

    return res.data.data;
  } catch (error) {
    console.error("Issue fetching user accepted properties:", error);
    throw error;
  }
};
