import { Router } from 'express';
import authMiddleware, { adminOnlyMiddleware } from '../middlewares/auth.js';
import poolUserRoutes from './poolOfUserRoutes.js';
import emailTemplateRoutes from './emailTemplateRoutes.js';

const router = Router();

// Проверка доступа к дашборду
router.get('/', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.json({ message: 'Вы авторизованы!', user: req.user });
});

// Подмаршрут для работы с pool_of_users
router.use('/clientUsers', authMiddleware, adminOnlyMiddleware, poolUserRoutes);

// Подмаршрут для работы с email_templates
router.use('/emailTemplates', emailTemplateRoutes);

export default router;