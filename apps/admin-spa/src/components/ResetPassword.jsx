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

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    match: false,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, [token, API_URL]);

  useEffect(() => {
    setPasswordChecks(validatePassword(newPassword, passwordConfirm));
  }, [newPassword, passwordConfirm]);

  const isFormValidReset = () => {
    if (token) {
      // Для сброса с токеном - проверяем только пароль и подтверждение
      return Object.values(passwordChecks).every(Boolean);
    } else {
      // Для смены пароля - проверяем email, текущий пароль и новые пароли
      return (
        email &&
        currentPassword &&
        Object.values(passwordChecks).every(Boolean)
      );
    }
  };

  const formValid = isFormValidReset();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formValid) {
      setError('Проверьте корректность введённых данных');
      return;
    }

    setLoading(true);
    try {
      if (token) {
        const response = await resetPassword({ token, password: newPassword });
        setMessage(response.message || 'Пароль успешно сброшен');
        setTimeout(() => navigate('/'), 2000);
      } else {
        const response = await changePassword({ email, oldPassword: currentPassword, newPassword });
        setMessage(response.message || 'Пароль успешно изменён');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при изменении пароля');
    }
    setLoading(false);
  };

  if (token && tokenError) {
    return (
      <div className="aam_reset-password-container">
        <p className="aam_error">Ссылка для сброса пароля недействительна или устарела.</p>
        <a href="/admin-spa/">На главную</a>
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
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="password"
          placeholder="Новый пароль"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Подтверждение пароля"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />

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

        {error && <p className="aam_error">{error}</p>}
        {message && <p className="aam_success">{message}</p>}

        <button type="submit" disabled={!formValid || loading}>
          {loading
            ? token ? 'Сброс пароля...' : 'Изменение пароля...'
            : token ? 'Сбросить пароль' : 'Изменить пароль'}
        </button>

        <a href="/">Отмена</a>
      </form>
    </div>
  );
};

export default ResetPassword;