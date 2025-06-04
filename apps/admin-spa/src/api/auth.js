// apps/admin-spa/src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const registerUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/api/users/register`, { email, password });
  return response.data;
};


export const resendConfirmationEmail = async (data) => {
  const res = await fetch('${API_URL}/api/users/resend-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка отправки письма');
  return await res.json();
}

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
  return response.data;
};

export const forgotPassword = async ({ email }) => {
  const response = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await axios.post(`${API_URL}/api/users/reset-password`, {
    token,
    password,
  });
  return response.data;
};

export const changePassword = async ({ email, oldPassword, newPassword }) => {
  const response = await axios.post(`${API_URL}/api/users/change-password`, {
    email,
    oldPassword,
    newPassword,
  });
  return response.data;
};