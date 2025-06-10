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

router.post('/', authMiddleware, adminOnlyMiddleware, createPoolUser);
router.get('/', authMiddleware, adminOnlyMiddleware, getPoolUsers);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, deletePoolUser);
router.put('/:id', authMiddleware, adminOnlyMiddleware, updatePoolUser);

export default router;