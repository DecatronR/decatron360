import axios from "axios";

export const fetchUserSchedule = async (userId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const token = sessionStorage.getItem("token");
  // if (!token) {
  //   console.error("No token found in session storage");
  //   return;
  // }

  if (!userId) {
    throw new Error("User ID is required to fetch schedule");
  }

  try {
    const res = await axios.get(
      `${baseUrl}/mySchedule/fetch`,
      { userID: userId },
      {
        withCredentials: true,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed fetching user schedule:", error);
    throw error;
  }
};
