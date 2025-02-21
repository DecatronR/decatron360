import axios from "axios";

export const fetchRefreeSchedule = async (referralCode) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.post(
      `${baseUrl}/mySchedule/fetchReferralSchedule`,
      { referralCode },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching refree schedule:", error);
    throw error;
  }
};
