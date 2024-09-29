import axios from "axios";

export const signInApi = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });
    console.log("response: ", res.data);
    const userId = res.data.user;
    const token = res.data.token;
    return { userId, token };
  } catch (error) {
    throw error;
  }
};
