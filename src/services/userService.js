import userModel from '../models/user.js';
import { comparePassword } from '../utils/hash.js';

const createUser = async ({ email, password, role = 'admin', planId = null }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const userId = await userModel.create({
    email,
    password, // хеширование происходит в модели
    role,
    planId,
  });

  return { id: userId, email, role };
};

const validateUser = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) return null;

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    email_confirmed: user.email_confirmed,
  };
};

const findUserByEmail = async (email) => {
  return await userModel.findByEmail(email);
};

const updatePassword = async (userId, newPassword) => {
  await userModel.updatePassword(userId, newPassword); // модель сама хеширует
};

const loginUser = async ({ email, password }) => {
  const user = await validateUser(email, password);
  if (!user) throw new Error('Неверный email или пароль');
  return user;
};

const markEmailConfirmed = async (userId) => {
  await userModel.markEmailConfirmed(userId);
};

const updateResetToken = async (userId, token) => {
  return await userModel.updateResetToken(userId, token);
};

const findUserById = async (userId) => {
  return await userModel.findById(userId);
};

const clearResetToken = async (userId) => {
  return await userModel.clearResetToken(userId);
};

export default {
  createUser,
  loginUser,
  validateUser,
  findUserByEmail,
  findUserById,
  updatePassword,
  markEmailConfirmed,
  updateResetToken,
  clearResetToken,
};