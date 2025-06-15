import EmailSendLog from '../models/emailSendLog.js';
import { sendHtmlEmail } from '../services/emailService.js'; // функция отправки email
import pool from '../config/db.js';

export const sendClientEmail = async (req, res) => {
  const { recipient_email, subject, html } = req.body;
  const { id: user_id, admin_id, email: sender_email } = req.user;

  if (!recipient_email || !subject || !html) {
    return res.status(400).json({ error: 'Неверные входные данные' });
  }

  try {
    await sendHtmlEmail({
      from: sender_email, // или кастомный адрес отправителя, если есть
      to: recipient_email,
      subject,
      html
    });

    await EmailSendLog.log({ admin_id, user_id, recipient_email });

    res.json({ message: 'Email успешно отправлен' });
  } catch (err) {
    console.error('Ошибка при отправке письма:', err);
    res.status(500).json({ error: 'Не удалось отправить письмо' });
  }
};