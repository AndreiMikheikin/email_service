//src\config\db.js

import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Конфигурация подключения
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {

  console.log('DB config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***' : undefined,
    database: process.env.DB_NAME,
  });

  try {
    const connection = await pool.getConnection();
    console.log('Подключение к базе успешно');
    connection.release();
  } catch (err) {
    console.error('Ошибка подключения к базе:', err.message);
  }
}

testConnection();

export default pool;