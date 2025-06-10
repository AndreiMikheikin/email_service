//src\routes\userRoutes.js

import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware, { adminOnlyMiddleware } from '../middlewares/auth.js';

import poolUserRoutes from './poolOfUserRoutes.js';

const router = Router();

router.post('/register', userController.register);
router.get('/confirm-email', userController.confirmEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', userController.changePassword);
router.post('/login', userController.login);
router.get('/reset-token-info', userController.getResetTokenInfo);

// защищённый маршрут
router.get('/adminDashboard', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.json({ message: 'Вы авторизованы!', user: req.user });
});

// Защищённые подмаршруты панели администратора
router.use('/adminDashboard/pool-users', authMiddleware, adminOnlyMiddleware, poolUserRoutes);

export default router;
