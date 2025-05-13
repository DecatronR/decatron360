import axios from "axios";

export const createContract = async (
  propertyId,
  propertyName,
  ownerId,
  ownerName,
  propertyPrice,
  propertyLocation
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  try {
    const res = await axios.post(
      `${baseUrl}/contract/create`,
      {
        propertyId,
        propertyName,
        ownerId,
        ownerName,
        propertyPrice,
        propertyLocation,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed to create contract:", error);
    throw error;
  }
};
