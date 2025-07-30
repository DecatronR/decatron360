import axios from "axios";

export const fetchLGAsByStateId = async (stateId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.get(
      `${baseUrl}/lga/getLGAsByStateId?stateId=${stateId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching LGAs by state ID:", error);
    throw error;
  }
};
