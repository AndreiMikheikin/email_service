// src/app.js

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3344',
  credentials: true
}));

app.use(express.json());

// Основной роутер
app.use('/api/users', userRoutes);

app.get('/health', (_, res) => res.send('OK'));

export default app;