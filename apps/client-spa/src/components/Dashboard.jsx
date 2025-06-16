import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../api/email';
import '../styles/components/_dashboard.scss';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: user?.email || '',
    to: '',
    subject: '',
    text: '',
    html: '',
  });

  useEffect(() => {
    if (user?.email && !form.from) {
      setForm(prev => ({ ...prev, from: user.email }));
    }
  }, [user, form.from]);

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.to.trim() || (!form.text.trim() && !form.html.trim())) {
      setStatus({ success: false, message: 'Укажите получателя и хотя бы одно тело письма.' });
      return;
    }

    setLoading(true);

    const payload = {
      recipient_email: form.to.trim(),
      subject: form.subject.trim(),
      html: form.html.trim() || form.text.trim()
    };

    try {
      await sendEmail(payload);
      setStatus({ success: true, message: 'Письмо успешно отправлено!' });
      setForm(prev => ({ ...prev, to: '', subject: '', text: '', html: '' }));
    } catch (err) {
      setStatus({ success: false, message: err.response?.data?.message || err.message || 'Ошибка при отправке письма.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="aam_dashboard">
      <button
        className="aam_dashboard__button aam_dashboard__button--logout"
        onClick={handleLogout}
      >
        Выйти
      </button>

      <h2 className="aam_dashboard__title">Отправка Email</h2>

      <form className="aam_dashboard__form" onSubmit={handleSubmit}>
        <label className="aam_dashboard__label" htmlFor="from">От кого:</label>
        <input
          id="from"
          className="aam_dashboard__input"
          name="from"
          type="email"
          value={form.from}
          disabled
        />

        <label className="aam_dashboard__label" htmlFor="to">Email получателя:</label>
        <input
          id="to"
          className="aam_dashboard__input"
          name="to"
          type="email"
          value={form.to}
          onChange={handleChange}
          required
        />

        <label className="aam_dashboard__label" htmlFor="subject">Тема:</label>
        <input
          id="subject"
          className="aam_dashboard__input"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
        />

        <label className="aam_dashboard__label" htmlFor="text">Текст (plain):</label>
        <textarea
          id="text"
          className="aam_dashboard__textarea"
          name="text"
          value={form.text}
          onChange={handleChange}
        />

        <label className="aam_dashboard__label" htmlFor="html">HTML:</label>
        <textarea
          id="html"
          className="aam_dashboard__textarea"
          name="html"
          value={form.html}
          onChange={handleChange}
        />

        <button
          className="aam_dashboard__button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>

        {status && (
          <div
            className={
              status.success
                ? 'aam_dashboard__status aam_dashboard__status--success'
                : 'aam_dashboard__status aam_dashboard__status--error'
            }
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Dashboard;