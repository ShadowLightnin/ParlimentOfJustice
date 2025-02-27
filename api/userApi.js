import axios from 'axios';

const BASE_URL = 'https://parlimentofjustice-7c2b9-default-rtdb.firebaseio.com/users.json';

export const addUser = async (userData) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error('Could not add new user');
  }
};
