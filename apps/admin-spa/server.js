// apps\admin-spa\server.js
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3344;

app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Admin SPA running at http://localhost:${PORT}`);
});