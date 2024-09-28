import axios from 'axios';

export const signOutApi = async () => {
  try {
    const res = await axios.get('http://localhost:8080/auth/logout', {}, { withCredentials: true });
    console.log("response: ", res);
    return res.data;
  } catch (error) {
    throw error;
  }
};
