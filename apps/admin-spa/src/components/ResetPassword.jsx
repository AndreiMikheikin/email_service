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
  const [tokenError, setTokenError] = useState(false);

  const [form, setForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/users/reset-token-info?token=${token}`)
        .then(res => {
          if (!res.ok) throw new Error('Токен неактуален или просрочен');
          return res.json();
        })
        .then(data => {
          setEmailFromToken(data.email);
        })
        .catch(() => {
          setTokenError(true);
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
        const response = await resetPassword({ token, newPassword });
        setMessage(response.message || 'Пароль успешно сброшен');
      } else {
        const response = await changePassword({ email, currentPassword, newPassword });
        setMessage(response.message || 'Пароль успешно изменён');
      }
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || err.message || 'Ошибка при изменении пароля');
    }
  };

  if (token && tokenError) {
    return (
      <div className="aam_reset-password-container">
        <p className="aam_error">Ссылка для сброса пароля недействительна или устарела.</p>
        <a href="/">На главную</a>
      </div>
    );
  }

  return (
    <div className="aam_reset-password-container">
      <form className="aam_reset-password-form" onSubmit={handleSubmit}>
        {token ? (
          <p>
            Электронная почта: <strong>{emailFromToken || '...'}</strong>
          </p>
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

        <div className="aam_password-checks">
          <p>Пароль должен содержать:</p>
          <ul>
            <li className={passwordChecks.length ? 'valid' : ''}>Минимум 8 символов</li>
            <li className={passwordChecks.lowercase ? 'valid' : ''}>Строчную букву</li>
            <li className={passwordChecks.uppercase ? 'valid' : ''}>Прописную букву</li>
            <li className={passwordChecks.number ? 'valid' : ''}>Цифру</li>
            <li className={passwordChecks.match ? 'valid' : ''}>Совпадение паролей</li>
          </ul>
        </div>

        <button type="submit">
          {token ? 'Сбросить пароль' : 'Изменить пароль'}
        </button>
        <a href="/">Отмена</a>
      </form>
    </div>
  );
};

export default ResetPassword;