// src/middlewares/auth.js

import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Отсутствует или некорректный токен' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

// Только для admin-роли
export function adminOnlyMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для администраторов' });
  }

  next();
}