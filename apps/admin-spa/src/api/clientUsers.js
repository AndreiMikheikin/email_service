import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const handleError = (error) => {
  const serverMessage = error.response?.data?.message;
  const message = serverMessage || error.message || 'Неизвестная ошибка';
  throw new Error(message);
};

// ✅ Запрос к новому эндпоинту clientUsers
export const getPoolUsers = async () => {
  try {
    const response = await apiClient.get('/api/adminDashboard/clientUsers');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
