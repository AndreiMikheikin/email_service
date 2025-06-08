// src/components/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/components/_login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await loginUser({ email, password });
      console.log('LOGIN DATA:', data);
      localStorage.setItem('authToken', data.token);
      navigate('/adminDashboard');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="aam_login-container">
      <form className="aam_login-form" onSubmit={handleSubmit}>
        <h2 className="aam_login-title">Вход</h2>
        <input
          className="aam_login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="aam_login-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="aam_login-button" type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        {message && <p className="aam_login-message">{message}</p>}

        <div className="aam_login-links">
          <a href="/forgot-password">Забыли пароль?</a>
          <a href="/reset-password">Сброс пароля</a>
          <a href="/register">Нет аккаунта? Регистрация</a>
        </div>
      </form>
    </div>
  );
};

export default Login;