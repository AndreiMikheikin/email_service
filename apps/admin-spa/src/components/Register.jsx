// apps\admin-spa\src\components\Register.jsx

import React, { useState, useEffect } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { validatePassword, isFormValid } from '../utils/validatePassword';
import '../styles/components/_register.scss';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    match: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setPasswordChecks(validatePassword(password, passwordConfirm));
  }, [password, passwordConfirm]);

  const formValid = isFormValid(email, password, passwordConfirm, passwordChecks);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formValid) {
      setMessage('Проверьте корректность введённых данных');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password });
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка регистрации');
    }
    setLoading(false);
  };

  return (
    <div className="aam_register-container">
      <form className="aam_register-form" onSubmit={handleSubmit}>
        <h2 className="aam_register-title">Регистрация</h2>

        <input
          className="aam_register-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          className="aam_register-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <input
          className="aam_register-input"
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

        <button
          className="aam_register-button"
          type="submit"
          disabled={!formValid || loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        {message && <p className="aam_register-message">{message}</p>}

        <div className="aam_register-links">
          <a href="/admin-spa/">Уже есть аккаунт? Войти</a>
        </div>
      </form>
    </div>
  );
};

export default Register;