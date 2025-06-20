// src/app.js

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
import clientAuthRoutes from './routes/clientAuthRoutes.js';
import clientEmailRoutes from './routes/clientEmailRoutes.js';

const app = express();

app.use(cors({
  origin: [
    'http://178.250.247.67',
    'http://178.250.247.67:3344', // admin-spa
    'http://178.250.247.67:3345'  // client-spa
  ],
  credentials: true
}));

app.use(express.json());

// Основной роутер
app.use('/api/users', userRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes);
app.use('/api/client-auth', clientAuthRoutes);
app.use('/api/client', clientEmailRoutes);

app.get('/health', (_, res) => res.send('OK'));

export default app;