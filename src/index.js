// src/index.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

console.log('DB_USER from env:', process.env.DB_USER);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});