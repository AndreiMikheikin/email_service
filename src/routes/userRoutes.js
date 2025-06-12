//src\routes\userRoutes.js

import { Router } from 'express';
import userController from '../controllers/userController.js';

const router = Router();

router.post('/register', userController.register);
router.get('/confirm-email', userController.confirmEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', userController.changePassword);
router.post('/login', userController.login);
router.get('/reset-token-info', userController.getResetTokenInfo);

export default router;