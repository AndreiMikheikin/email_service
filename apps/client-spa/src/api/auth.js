import axios from 'axios';

const API = '/api/client-auth'; // Прокси настроен на /api

export const login = async ({ email, password }) => {
  const response = await axios.post(`${API}/login`, { email, password });
  return response.data;
};