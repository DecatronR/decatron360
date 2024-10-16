import axios from "axios";

export const fetchPropertyTypes = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8080/propertyType/fetchPropertyType",
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching favourite properties:", error);
    throw error;
  }
};
