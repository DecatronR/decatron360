import axios from "axios";

export const PropertyRequestRegistration = async (registrationData) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/auth/propertyRequestRegistration`,
      registrationData
    );
    return res.data;
  } catch (error) {
    console.error("Error registering user for property request:", error);
    throw error;
  }
};
