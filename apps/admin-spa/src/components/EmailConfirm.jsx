import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendConfirmationEmail } from '../api/auth';
import '../styles/components/_emailConfirm.scss';

const EmailConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'expired'
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(3);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://178.250.247.67:3355';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Отсутствует токен подтверждения.');
      return;
    }

    async function confirmEmail() {
      try {
        const res = await fetch(`${API_URL}/api/users/confirm-email?token=${token}`);
        if (res.ok) {
          setStatus('success');
          setCountdown(3); // стартуем отсчет
        } else {
          const data = await res.json();
          if (data.message === 'Token expired') {
            setStatus('expired');
          } else {
            setStatus('error');
            setErrorMessage(data.message || 'Ошибка подтверждения');
          }
        }
      } catch (e) {
        setStatus('error');
        setErrorMessage('Сетевая ошибка');
      }
    }

    confirmEmail();
  }, [token]);

  // Отсчет при статусе success
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

  const handleResend = async () => {
    if (!email) {
      alert('Введите email');
      return;
    }
    try {
      await resendConfirmationEmail({ email });
      alert('Письмо с подтверждением отправлено повторно');
    } catch (e) {
      alert('Ошибка при отправке письма');
    }
  };

  return (
    <div className="aam_email-confirm-container">
      {status === 'loading' && <p className="aam_email-confirm-message loading">Подтверждение...</p>}

      {status === 'success' && (
        <p className="aam_email-confirm-message success">
          Почта успешно подтверждена! Перенаправляем на вход через {countdown}...
        </p>
      )}

      {status === 'error' && (
        <p className="aam_email-confirm-message error">
          Ошибка: {errorMessage}
        </p>
      )}

      {status === 'expired' && (
        <div className="aam_email-confirm-message expired">
          <p>Ссылка подтверждения истекла. Введите email для повторной отправки письма:</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={handleResend}>Отправить повторно</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirm;