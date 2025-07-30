import axios from "axios";

export const fetchProperties = async (params = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const userId = sessionStorage.getItem("userId");

  try {
    // Default parameters to get all properties
    const defaultParams = {
      page: 1,
      limit: 100, // Increase limit to get more properties
      status: "all", // Get all statuses
      showAll: true, // Explicitly request all properties
      ...params,
    };

    // Add user ID if available (might be needed for backend filtering)
    if (userId) {
      defaultParams.userId = userId;
    }

    const res = await axios.get(
      `${baseUrl}/propertyListing/fetchPropertyListing`,
      {
        params: defaultParams,
        withCredentials: true,
      }
    );
    // Handle the response structure: {responseCode, responseMessage, data}
    const properties = res.data.data || res.data;
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
