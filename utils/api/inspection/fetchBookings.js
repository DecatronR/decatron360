import axios from "axios";

export const fetchBooking = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking id is required to fetch booking");
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/booking/booking",
      { id: bookingId },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching booking:", error);
    throw error;
  }
};
