import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем корректный __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3344;

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Обработка всех маршрутов для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Admin SPA running at http://localhost:${PORT}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
});