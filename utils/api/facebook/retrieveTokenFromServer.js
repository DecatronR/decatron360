import axios from "axios";

export const retrieveTokenFromServer = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }

  try {
    const response = await axios.get(`${baseUrl}/facebook/get-token`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Ensures cookies are sent with the request
    });
    console.log("Facebook token:", response.data);
  } catch (error) {
    console.error(
      "Error fetching Facebook data:",
      error.response?.data || error.message
    );
  }
};
