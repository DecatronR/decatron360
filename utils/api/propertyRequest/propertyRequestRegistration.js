import axios from "axios";

export const PropertyRequestRegistration = async (
  name,
  email,
  phone,
  role,
  state,
  lga,
  neighborhood,
  listingType,
  password,
  confirmpassword
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(`${baseUrl}/auth/registerAgent`, {
      name,
      email,
      phone,
      role,
      state,
      lga,
      neighborhood,
      listingType,
      password,
      confirmpassword,
    });
    return res.data;
  } catch (error) {
    console.error("Error registering user for property request:", error);
    throw error;
  }
};
