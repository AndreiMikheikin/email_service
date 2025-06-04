import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resetPassword, changePassword } from '../api/auth';
import { validatePassword } from '../utils/validatePassword';
import '../styles/components/_resetPassword.scss';

const ResetPassword = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');

  const [emailFromToken, setEmailFromToken] = useState('');
  const [form, setForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/users/reset-token-info?token=${token}`)
        .then(res => {
          if (!res.ok) throw new Error('Не удалось получить email');
          return res.json();
        })
        .then(data => {
          setEmailFromToken(data.email);
        })
        .catch(() => {
          setEmailFromToken('');
        });
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, currentPassword, newPassword, confirmNewPassword } = form;

    if (newPassword !== confirmNewPassword) {
      return setError('Пароли не совпадают');
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      return setError(validationError);
    }

    try {
      if (token) {
        await resetPassword({ token, newPassword });
        setMessage('Пароль успешно сброшен');
      } else {
        await changePassword({ email, currentPassword, newPassword });
        setMessage('Пароль успешно изменён');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при изменении пароля');
    }
  };

  return (
    <div className="aam_reset-password-container">
      <form className="aam_reset-password-form" onSubmit={handleSubmit}>
        {token ? (
          <>
            <p>Электронная почта: <strong>{emailFromToken || 'неизвестно'}</strong></p>
          </>
        ) : (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="currentPassword"
              placeholder="Старый пароль"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="password"
          name="newPassword"
          placeholder="Новый пароль"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Подтверждение нового пароля"
          value={form.confirmNewPassword}
          onChange={handleChange}
          required
        />
        {error && <p className="aam_error">{error}</p>}
        {message && <p className="aam_success">{message}</p>}
        <button type="submit">
          {token ? 'Сбросить пароль' : 'Изменить пароль'}
        </button>
        <a href="/">Отмена</a>
      </form>
    </div>
  );
};

export default ResetPassword;