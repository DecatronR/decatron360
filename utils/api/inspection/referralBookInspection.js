import axios from "axios";

export const referralBookInspection = async (
  userID,
  propertyID,
  referralCode,
  bookingDateTime
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/booking/book`,
      { userID, propertyID, referralCode, bookingDateTime },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to book inspection:", error);
    throw error;
  }
};
