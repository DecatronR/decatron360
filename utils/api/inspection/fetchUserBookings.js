import axios from "axios";

export const fetchUserBookings = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!userId) {
    throw new Error("User ID is required to fetch bookings");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/booking/getMyBooking`,
      { userID: userId },
      { withCredentials: true }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed fetching user bookings:", error);
    throw error;
  }
};
