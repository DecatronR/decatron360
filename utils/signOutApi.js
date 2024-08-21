import axios from 'axios';

export const signOutApi = async () => {
  try {
    const res = await axios.post('http://localhost:8080/auth/logout');
    console.log("response: ", res);
    return res.data;
  } catch (error) {
    throw error;
  }
};
