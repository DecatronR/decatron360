import axios from "axios";

export const editPropertyListing = async (propertyId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found in session storage");
    throw new Error("Authentication token not found");
  }

  try {
    const res = await axios.post(
      `${baseUrl}/propertyListing/editPropertyListing`,
      { id: propertyId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to edit property listing:", error);
    throw error;
  }
};
