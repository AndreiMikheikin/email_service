import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3344;

app.use(compression());

app.use('/api', createProxyMiddleware({
  target: process.env.API_URL || 'http://178.250.247.67:3355',
  changeOrigin: true,
  secure: false,
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(502).json({ error: 'Proxy error', details: err.message });
  }
}));

// SSR для admin-spa
app.get('/admin-spa*', async (req, res) => {
  try {
    const template = await fs.readFile(
      path.join(__dirname, 'dist/client/index.html'), 
      'utf-8'
    );
    
    const { render } = await import('./dist/server/entry-server.js');
    const appHtml = await render(req.url);
    
    res.send(template.replace('<!--app-html-->', appHtml));
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send('Server Error');
  }
});

// Sitemap
const baseUrl = 'http://178.250.247.67';
const urls = ['/', '/client-spa/', '/admin-spa/'];

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

// fallback для остальных запросов — либо 404, либо тоже SSR, или просто send статус
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error('Express error:', err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Admin SPA server started on port', process.env.PORT);
  console.log(`Admin SPA server listening at http://178.250.247.67:${PORT}`);
  console.log(`Proxying /api to: ${process.env.API_URL || 'http://178.250.247.67:3355'}`);
});