import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // JWT обычно без куки, ставим false
});

// Интерсептор для добавления токена в заголовок Authorization
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Обработчик ошибок
export const handleError = (error) => {
  const serverMessage = error.response?.data?.message;
  const message = serverMessage || error.message || 'Неизвестная ошибка';
  throw new Error(message);
};

export const sendEmail = async (data) => {
  try {
    console.log(data);
    const response = await apiClient.post('/api/client/send-email', data);
    return response.data;
  } catch (error) {
    console.error(error);
    handleError(error);
  }
};