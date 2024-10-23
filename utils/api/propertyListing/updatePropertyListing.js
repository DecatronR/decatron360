import axios from "axios";

export const updatePropertyListing = async (updatedListingData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  const updatedListingConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/propertyListing/updatePropertyListing`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // set to multipart for file upload
    },
    data: updatedListingData,
    withCredentials: true,
  };
  try {
    await axios(updatedListingConfig);
  } catch (error) {
    console.error("Failed to update property listing:", error);
    throw error;
  }
};
