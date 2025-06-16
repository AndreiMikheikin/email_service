import { useState } from 'react';
import { sendEmail } from '../api/email';
import '../styles/components/_dashboard.scss';

const Dashboard = ({ user }) => {
    const [form, setForm] = useState({
        from: user?.email || '',
        to: '',
        subject: '',
        text: '',
        html: '',
    });

    useEffect(() => {
        // На случай, если email появится после монтирования (например, после login)
        if (user?.email && !form.from) {
            setForm(prev => ({ ...prev, from: user.email }));
        }
    }, [user]);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        if (!form.to || (!form.text && !form.html)) {
            setStatus({ success: false, message: 'Укажите получателя и хотя бы одно тело письма.' });
            setLoading(false);
            return;
        }

        try {
            await sendEmail(form);
            setStatus({ success: true, message: 'Письмо успешно отправлено!' });
        } catch (err) {
            setStatus({ success: false, message: err?.response?.data?.message || 'Ошибка при отправке письма.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="aam_dashboard">
            <h2 className="aam_dashboard__title">Отправка Email</h2>
            <form className="aam_dashboard__form" onSubmit={handleSubmit}>
                <label className="aam_dashboard__label">От кого:</label>
                <input
                    className="aam_dashboard__input"
                    name="from"
                    type="email"
                    value={form.from}
                    disabled
                />

                <label className="aam_dashboard__label">Email получателя:</label>
                <input
                    className="aam_dashboard__input"
                    name="to"
                    type="email"
                    value={form.to}
                    onChange={handleChange}
                    required
                />

                <label className="aam_dashboard__label">Тема:</label>
                <input
                    className="aam_dashboard__input"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                />

                <label className="aam_dashboard__label">Текст (plain):</label>
                <textarea
                    className="aam_dashboard__textarea"
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                />

                <label className="aam_dashboard__label">HTML:</label>
                <textarea
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