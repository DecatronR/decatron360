import axios from 'axios';

export const signInApi = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8080/auth/login', { email, password });
    console.log("response: ", res.data);
    return res.data.user;
  } catch (error) {
    throw error;
  }
};
