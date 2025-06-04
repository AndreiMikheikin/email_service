import axios from 'axios';

// Используем VITE_API_URL из .env или fallback URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3355';

// Общий конфиг для axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // если используете куки/сессии
});

// Обработчик ошибок
const handleError = (error) => {
  if (error.response) {
    return Promise.reject(error.response.data.message || 'Ошибка сервера');
  } else if (error.request) {
    return Promise.reject('Нет ответа от сервера');
  } else {
    return Promise.reject('Ошибка при отправке запроса');
  }
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
    handleError(error);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/api/users/login', { email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await apiClient.post('/api/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await apiClient.post('/api/users/reset-password', { token, password });
    return response.data;
  } catch (error) {
    handleError(error);
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
    handleError(error);
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