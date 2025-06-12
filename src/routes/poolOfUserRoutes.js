// src\routes\poolOfUserRoutes.js
import express from 'express';
import {
  createPoolUser,
  getPoolUsers,
  deletePoolUser,
  updatePoolUser
} from '../controllers/poolOfUserController.js';

const router = express.Router();

router.post('/create', createPoolUser);
router.get('/', getPoolUsers);
router.delete('/delete/:id', deletePoolUser);
router.put('/edit/:id', updatePoolUser);

export default router;