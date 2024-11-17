import axios from "axios";

export const updateSchedule = async (userId, availability) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  if (!userId) {
    throw new Error("Schedule id is required to update booking");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/update`,
      { userId, availability },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed updating schedule:", error);
    throw error;
  }
};
