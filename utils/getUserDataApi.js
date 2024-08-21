import axios from 'axios';

export const userDataApi = async (userId) => {
  try {
    const res = await axios.post('http://localhost:8080/users/editUsers', { id: userId }, { withCredentials: true });
    console.log("user data: ", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
