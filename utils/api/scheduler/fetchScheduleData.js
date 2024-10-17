import axios from "axios";

export const fetchScheduleData = async (scheduleId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!bookingId) {
    throw new Error("Schedule id is required to fetch schedule");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/edit`,
      { id: scheduleId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching schedule:", error);
    throw error;
  }
};
