import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const clientAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Нет токена авторизации' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'client') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Неверный токен' });
  }
};