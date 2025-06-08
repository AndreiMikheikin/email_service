import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword, changePassword } from '../api/auth';
import { validatePassword } from '../utils/validatePassword';
import '../styles/components/_resetPassword.scss';

const ResetPassword = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
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

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    match: false,
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

  // Получаем email по токену
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
  }, [token, API_URL]);

  // Валидация пароля при изменении
  useEffect(() => {
    setPasswordChecks(validatePassword(form.newPassword, form.confirmNewPassword));
  }, [form.newPassword, form.confirmNewPassword]);

  // Проверка валидности формы (для кнопки)
  const isFormValidReset = (form, checks, tokenExists) => {
    if (tokenExists) {
      return checks.length && checks.lowercase &&
        checks.uppercase && checks.number && checks.match;
    } else {
      return form.email.length > 0 &&
        form.currentPassword.length > 0 &&
        checks.length && checks.lowercase &&
        checks.uppercase && checks.number && checks.match;
    }
  };

  const formValid = isFormValidReset(form, passwordChecks, !!token);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formValid) {
      setError('Проверьте корректность введённых данных');
      return;
    }

    setLoading(true);
    try {
      if (token) {
        const response = await resetPassword({ token, newPassword: form.newPassword });
        setMessage(response.message || 'Пароль успешно сброшен');
        // Можно после успешного сброса делать редирект на логин
        setTimeout(() => navigate('/'), 2000);
      } else {
        const response = await changePassword({
          email: form.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
        setMessage(response.message || 'Пароль успешно изменён');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || err.message || 'Ошибка при изменении пароля');
    }
    setLoading(false);
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
      <form className="aam_reset-password-form" onSubmit={handleSubmit} noValidate>
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

        <button type="submit" disabled={!formValid || loading}>
          {loading ? (token ? 'Сброс пароля...' : 'Изменение пароля...') : (token ? 'Сбросить пароль' : 'Изменить пароль')}
        </button>
        <a href="/">Отмена</a>
      </form>
    </div>
  );
};

export default ResetPassword;