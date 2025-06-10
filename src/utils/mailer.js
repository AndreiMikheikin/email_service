// src\utils\mailer.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    return await transporter.sendMail({
      from: `"EMAIL-SERVICE" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Ошибка при отправке письма:', err.message);
    throw err;
  }
};

/**
 * Отправка уведомления о создании client-пользователя
 * @param {string} toEmail — Email клиента
 * @param {string} password — Пароль клиента
 * @param {string} adminEmail — Email администратора, который создал
 */
export const sendUserCreatedEmail = async (toEmail, password, adminEmail) => {
  const subject = 'Вам предоставлен доступ к Email-сервису';
  const html = `
    <p>Администратор <b>${adminEmail}</b> предоставил вам доступ.</p>
    <p>Ваш логин: <b>${toEmail}</b></p>
    <p>Ваш пароль: <b>${password}</b></p>
    <p>Используйте эти данные для входа в клиентский интерфейс Email-сервиса.</p>
  `;

  await sendMail({ to: toEmail, subject, html });
};