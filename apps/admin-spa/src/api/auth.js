import axios from 'axios';

// Используем VITE_API_URL из .env или fallback URL
const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67/admin-spa/';

// Общий конфиг для axios
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

export const registerUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/api/users/register', { email, password });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const resendConfirmationEmail = async (data) => {
  try {
    const response = await apiClient.post('/api/users/resend-confirmation', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/api/users/login', { email, password });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await apiClient.post('/api/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await apiClient.post('/api/users/reset-password', { token, password });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const changePassword = async ({ email, oldPassword, newPassword }) => {
  try {
    const response = await apiClient.post('/api/users/change-password', {
      email,
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const confirmEmail = async (token) => {
  try {
    const response = await apiClient.post('/api/users/confirm-email', { token });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchAdminDashboard = async () => {
  try {
    const response = await apiClient.get('/api/adminDashboard');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Добавляем интерсепторы при необходимости
apiClient.interceptors.request.use(config => {
  // Можно добавить токен авторизации
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
}); 