import axios from "axios";

export const updatePropertyListing = async (updatedListingData) => {
  const updatedListingConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/propertyListing/updatePropertyListing",
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
