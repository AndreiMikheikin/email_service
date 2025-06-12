import { Router } from 'express';
import authMiddleware, { adminOnlyMiddleware } from '../middlewares/auth.js';
import poolUserRoutes from './poolOfUserRoutes.js';

const router = Router();

// Проверка доступа к дашборду
router.get('/', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.json({ message: 'Вы авторизованы!', user: req.user });
});

// Подмаршрут для работы с pool_of_users
router.use('/clientUsers', authMiddleware, adminOnlyMiddleware, poolUserRoutes);

export default router;