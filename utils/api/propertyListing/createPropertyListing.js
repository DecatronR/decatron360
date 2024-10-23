import axios from "axios";

export const createPropertyListing = async (createListingData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  const createListingConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/propertyListing/createPropertyListing`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data: createListingData,
    withCredentials: true,
  };
  try {
    await axios(createListingConfig);
  } catch (error) {
    console.error("Failed to create new property listing:", error);
    throw error;
  }
};
