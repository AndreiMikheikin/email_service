// apps\client-spa\src\api\auth.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // если используете куки/сессии
});

// Обработчик ошибок
export const handleError = (error) => {
  const serverMessage = error.response?.data?.message;
  const message = serverMessage || error.message || 'Неизвестная ошибка';
  throw new Error(message);
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post(`/api/client-auth/login`, { email, password });
  return response.data;
};