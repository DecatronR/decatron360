import axios from "axios";

export const signInApi = async (email, password) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, {
      email,
      password,
    });
    const userId = res.data.user;
    const token = res.data.token;
    return { userId, token };
  } catch (error) {
    throw error;
  }
};
