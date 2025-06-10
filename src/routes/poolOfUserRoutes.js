// src\routes\poolOfUserRoutes.js
import express from 'express';
import {
  createPoolUser,
  getPoolUsers,
  deletePoolUser,
  updatePoolUser
} from '../controllers/poolOfUserController.js';
import authMiddleware, { adminOnlyMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', authMiddleware, adminOnlyMiddleware, createPoolUser);
router.get('/clientUsers', authMiddleware, adminOnlyMiddleware, getPoolUsers);
router.delete('/delete/:id', authMiddleware, adminOnlyMiddleware, deletePoolUser);
router.put('/edit/:id', authMiddleware, adminOnlyMiddleware, updatePoolUser);

export default router;