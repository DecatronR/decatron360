import axios from "axios";

export const PropertyRequestRegistration = async (
  name,
  email,
  phone,
  role,
  state,
  lga,
  listingType,
  password,
  confirmpassword
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(
      `${baseUrl}/auth/propertyRequestRegistration`,
      {
        name,
        email,
        phone,
        role,
        state,
        lga,
        listingType,
        password,
        confirmpassword,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error registering user for property request:", error);
    throw error;
  }
};
