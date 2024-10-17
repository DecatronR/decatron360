import axios from "axios";

export const createSchedule = async (userId, date, time) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/create`,
      { userId, date, time },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to create schedule:", error);
    throw error;
  }
};
