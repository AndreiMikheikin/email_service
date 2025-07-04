// apps\admin-spa\src\api\clientUsers.js

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

// Запрос к новому эндпоинту clientUsers
export const getPoolUsers = async () => {
  try {
    const response = await apiClient.get('/api/adminDashboard/clientUsers');
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createPoolUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/api/adminDashboard/clientUsers/create', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updatePoolUserPassword = async (id, password) => {
  try {
    const response = await apiClient.put(`/api/adminDashboard/clientUsers/edit/${id}`, { password });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deletePoolUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/adminDashboard/clientUsers/delete/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;