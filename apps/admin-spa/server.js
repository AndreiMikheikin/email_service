import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Загружаем .env
dotenv.config();

// Получаем __dirname для ES-модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3344;

// Прокси для API
app.use('/api', createProxyMiddleware({
  target: process.env.API_URL || 'http://localhost:3355',
  changeOrigin: true,
  secure: false,
}));

// Отдаём статику из dist
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Обработка всех остальных запросов — отдаём index.html (для SPA маршрутизации)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Express error:', err.stack);
  res.status(500).send('Internal Server Error');
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Admin SPA server listening at http://localhost:${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`Proxying /api to: ${process.env.API_URL || 'http://localhost:3355'}`);
});