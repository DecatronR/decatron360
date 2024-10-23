import axios from "axios";

export const fetchUserBookings = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  if (!userId) {
    throw new Error("User ID is required to fetch user bookings");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/booking/getMyBooking`,
      { userID: userId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed fetching user bookings:", error);
    throw error;
  }
};
