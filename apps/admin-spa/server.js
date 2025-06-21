import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import compression from 'compression';

// Загружаем .env
dotenv.config();

// Получаем __dirname для ES-модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3344;

app.use(compression());

// Прокси для API
app.use('/api', createProxyMiddleware({
  target: process.env.API_URL || 'http://178.250.247.67:3355',
  changeOrigin: true,
  secure: false,
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Proxy error', details: err.message });
  }
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

// SSR рендер
app.get('/admin-spa/*', async (req, res) => {
  try {
    // Загрузить index.html как шаблон
    const templatePath = path.join(__dirname, 'dist', 'index.html');
    let template = await fs.readFile(templatePath, 'utf-8');

    // Импортировать серверный бандл динамически
    const { render } = await import(path.join(__dirname, 'dist', 'server', 'entry-server.js'));

    // Рендер React в строку
    const appHtml = render(req.originalUrl);

    // Вставить рендер в шаблон
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    console.error('SSR error:', e);
    res.status(500).send('Ошибка сервера');
  }
});

const baseUrl = 'http://178.250.247.67';
const urls = [
  '/',
  '/client-spa/',
  '/admin-spa/',
  // сюда потом динамические страницы можно добавить
];

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
  res.send(sitemap);
});

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
  console.log(`Admin SPA server listening at http://178.250.247.67:${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`Proxying /api to: ${process.env.API_URL || 'http://178.250.247.67:3355'}`);
});