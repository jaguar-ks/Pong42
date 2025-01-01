import axios from 'axios';

export const getCurrentUser = async () => {
  const { data } = await axios.get(`${process.env.API_BASE_URI}${url}`, {
    withCredentials: true
  });
  return data;
};