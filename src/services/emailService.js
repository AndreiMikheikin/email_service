import { sendMail } from '../utils/mailer.js';

/**
 * Отправка HTML-письма от client-пользователя
 * @param {Object} params
 * @param {string} params.from — Email отправителя (client-user)
 * @param {string} params.to — Email получателя
 * @param {string} params.subject — Тема письма
 * @param {string} params.html — HTML содержимое письма
 */
export const sendHtmlEmail = async ({ from, to, subject, html }) => {
  return await sendMail({
    to,
    subject,
    html: `
      <p><b>Отправитель:</b> ${from}</p>
      <hr/>
      ${html}
    `,
  });
};
