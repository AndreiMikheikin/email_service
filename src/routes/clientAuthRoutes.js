import express from 'express';
import clientAuthController from '../controllers/clientAuthController.js';

const router = express.Router();

router.post('/login', clientAuthController.login);

export default router;