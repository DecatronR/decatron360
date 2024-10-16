import axios from "axios";

export const updatePropertyListing = async (updatedListingData) => {
  const baseUrl = process.env.BASE_URL;
  const updatedListingConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/propertyListing/updatePropertyListing`,
    headers: {
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
