import axios from "axios";

export const fetchAgentSchedule = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!userId) {
    throw new Error("User ID is required to fetch schedule");
  }

  try {
    const res = await axios.get(
      `${baseUrl}/mySchedule/fetch`,
      { userID: userId },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching user schedule:", error);
    throw error;
  }
};
