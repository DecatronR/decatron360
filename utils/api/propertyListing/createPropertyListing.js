import axios from "axios";

export const createPropertyListing = async (createListingData) => {
  const createListingConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/propertyListing/createPropertyListing",
    headers: {
      "Content-Type": "multipart/form-data", // set to multipart for file upload
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
