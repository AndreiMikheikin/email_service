// src/app.js

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());

// Основной роутер
app.use('/api/users', userRoutes);

app.get('/health', (_, res) => res.send('OK'));

export default app;