import axios from "axios";

export const scheduleBooked = async (scheduleId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!scheduleId) {
    throw new Error("User ID is required to fetch schedule");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/scheduleBooked`,
      { id: scheduleId },
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
