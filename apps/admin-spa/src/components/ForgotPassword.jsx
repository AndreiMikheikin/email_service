// apps\admin-spa\src\components\ForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import '../styles/components/_forgotPassword.scss';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await forgotPassword({ email });
      setStatus('success');
      setCountdown(3);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Произошла ошибка');
    }
  };

  useEffect(() => {
    if (status !== 'success') return;

    if (countdown === 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, status, navigate]);

  return (
    <div className="aam_forgot-container">
      {status === 'success' ? (
        <p className="aam_forgot-message success">
          Если адрес существует в базе, мы отправим вам ссылку для сброса пароля.
        </p>
      ) : (
        <form className="aam_forgot-form" onSubmit={handleSubmit}>
          <h2>Восстановление пароля</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Отправка...' : 'Отправить ссылку'}
          </button>
          {status === 'error' && (
            <p className="aam_forgot-message error">{errorMessage}</p>
          )}
          <a href="/">Отмена</a>
        </form>
      )}
      
    </div>
  );
};

export default ForgotPassword;