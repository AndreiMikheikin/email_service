// src\controllers\poolOfUserController.js

import PoolOfUser from '../models/poolOfUsers.js';
import { sendUserCreatedEmail } from '../utils/mailer.js'; // отправка уведомления пользователю

export const createPoolUser = async (req, res) => {
  try {
    const admin_id = req.user.id; // из auth middleware, id текущего admin
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // Проверим, нет ли уже пользователя с таким email
    const existingUser = await PoolOfUser.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const userId = await PoolOfUser.create({ admin_id, email, password });

    // Отправим email с уведомлением
    await sendUserCreatedEmail(email, password, req.user.email);

    res.status(201).json({ message: 'Пользователь создан', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getPoolUsers = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const users = await PoolOfUser.findAllByAdminId(admin_id);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
};

export const deletePoolUser = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const id = req.params.id;

    const deleted = await PoolOfUser.deleteById(id, admin_id);
    if (!deleted) {
      return res.status(404).json({ message: 'Пользователь не найден или не принадлежит вам' });
    }

    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
};

export const updatePoolUser = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const id = req.params.id;
    const { email, password } = req.body;

    const updated = await PoolOfUser.updateById({ id, admin_id, email, password });
    if (!updated) {
      return res.status(404).json({ message: 'Пользователь не найден или не принадлежит вам' });
    }

    res.json({ message: 'Пользователь обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
  }
};