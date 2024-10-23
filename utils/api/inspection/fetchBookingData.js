import axios from "axios";

export const fetchBookingData = async (bookingId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }

  if (!bookingId) {
    throw new Error("Booking id is required to fetch booking");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/booking/getBooking`,
      { id: bookingId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed fetching booking:", error);
    throw error;
  }
};
