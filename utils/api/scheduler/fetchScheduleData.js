import axios from "axios";

export const fetchScheduleData = async (scheduleId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  if (!bookingId) {
    throw new Error("Schedule id is required to fetch schedule");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/edit`,
      { id: scheduleId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching schedule:", error);
    throw error;
  }
};
