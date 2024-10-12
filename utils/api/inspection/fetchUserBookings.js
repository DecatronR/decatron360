import axios from "axios";

export const fetchUserBookings = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch bookings");
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/booking/userBookings",
      { userID: userId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching user bookings:", error);
    throw error;
  }
};
