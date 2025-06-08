// src/controllers/userController.js

import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/mailer.js';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const existing = await userService.findUserByEmail(email);

    if (existing) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = await userService.createUser({ email, password });

    const confirmToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const confirmUrl = `http://178.250.247.67:3344/confirm-email?token=${confirmToken}`;

    await sendMail({
      to: user.email,
      subject: 'Подтверждение регистрации',
      html: `
        <h3>Добро пожаловать!</h3>
        <p>Пожалуйста, подтвердите вашу почту, перейдя по ссылке:</p>
        <a href="${confirmUrl}">${confirmUrl}</a>
      `,
    });

    res.status(201).json({ message: 'Регистрация прошла успешно. Подтвердите email.', user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await userService.markEmailConfirmed(userId);

    res.json({ message: 'Email подтвержден!' });
  } catch (err) {
    console.log(err.message);
    console.error('Ошибка подтверждения email:', err.message);
    res.status(400).json({
      message: 'Неверный или просроченный токен',
      error: err.message
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email обязателен' });

    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Сохраняем токен в базе
    await userService.updateResetToken(user.id, token);

    const resetUrl = `http://178.250.247.67:3344/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      html: `
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Срок действия ссылки — 1 час.</p>
      `,
    });

    res.json({ message: 'Письмо с инструкцией отправлено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка восстановления пароля' });
  }
};

const resetPassword = async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Токен и новый пароль обязательны' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: 'Недействительный или истекший токен' });
    }

    const user = await userService.findUserById(payload.id);
    if (!user || user.reset_token !== token) {
      return res.status(400).json({ message: 'Неверный токен' });
    }

    await userService.updatePassword(user.id, password);
    await userService.clearResetToken(user.id);

    res.json({ message: 'Пароль успешно обновлён' });
  } catch (err) {
    console.error('resetPassword ошибка:', err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Email, старый и новый пароли обязательны' });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем старый пароль
    const isValid = await userService.validateUser(email, oldPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Неверный старый пароль' });
    }

    // Обновляем пароль
    await userService.updatePassword(user.id, newPassword);

    res.json({ message: 'Пароль успешно изменён' });
  } catch (err) {
    console.error('changePassword ошибка:', err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (!user.email_confirmed) {
      return res.status(403).json({ message: 'Email не подтверждён' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not defined');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '2h' }
    );

    res.json({ token, ...user });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка авторизации' });
  }
};

const getResetTokenInfo = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    console.warn('Токен не передан в запросе');
    return res.status(400).json({ message: 'Токен обязателен' });
  }

  try {
    // Декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      console.warn('Токен не содержит id пользователя');
      return res.status(400).json({ message: 'Неверный токен' });
    }

    // Получаем пользователя из БД
    const user = await userService.findUserById(userId);

    if (!user) {
      console.warn(`Пользователь с id ${userId} не найден`);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Сравниваем токен
    if (user.reset_token !== token) {
      console.warn('Токен не совпадает с сохранённым в базе');
      return res.status(400).json({ message: 'Токен неактуален или уже использован' });
    }

    // Всё хорошо
    console.log(`Email ${user.email} найден и подтверждён по токену`);
    return res.json({ email: user.email });

  } catch (error) {
    console.error('Ошибка при проверке токена сброса пароля:', error.message);
    return res.status(400).json({ message: 'Неверный или просроченный токен' });
  }
};


export default {
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  login,
  getResetTokenInfo,
};