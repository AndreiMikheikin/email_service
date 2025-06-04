// tests/auth.test.js
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import pool from '../config/db.js';

const testEmail = process.env.SMTP_USER;
const testPassword = 'StrongTestPass123!';

if (!testEmail) {
    throw new Error('Для теста не задан SMTP_USER в .env');
}

beforeAll(async () => {
    // Удаляем тестового пользователя перед запуском
    await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
});

afterAll(async () => {
    // Удаляем тестового пользователя после завершения тестов
    await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
    await pool.end();
});

describe('Аутентификация', () => {
    let token = '';
    let resetToken = '';

    it('регистрирует пользователя', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ email: testEmail, password: testPassword });

        if (res.statusCode !== 201) {
            console.error('Регистрация ошибка:', res.body);
        }

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('email', testEmail);
    });

    it('подтверждает email вручную', async () => {
        await pool.query('UPDATE users SET email_confirmed = 1 WHERE email = ?', [testEmail]);
        const [rows] = await pool.query('SELECT email_confirmed FROM users WHERE email = ?', [testEmail]);
        expect(rows[0].email_confirmed).toBe(1);
    });

    it('выполняет логин', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: testEmail, password: testPassword });

        if (res.statusCode !== 200) {
            console.error('Логин ошибка:', res.body);
        }

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('отправляет письмо для сброса пароля', async () => {
        const res = await request(app)
            .post('/api/users/forgot-password')
            .send({ email: testEmail });

        if (res.statusCode !== 200) {
            console.error('Forgot-password ошибка:', res.body);
        }

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Письмо с инструкцией отправлено");
    });

    it('создает новый пароль по токену (заглушка)', async () => {
        // Берём reset_token из базы (он должен быть записан в forgot-password)
        const [rows] = await pool.query('SELECT reset_token FROM users WHERE email = ?', [testEmail]);
        resetToken = rows[0]?.reset_token;

        expect(resetToken).toBeDefined();

        const res = await request(app)
            .post('/api/users/reset-password')
            .send({ token: resetToken, password: 'NewTestPass123!' });


        if (res.statusCode !== 200) {
            console.error('Reset-password ошибка:', res.body);
        }

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/успешно/i);
    });

    it('входит с новым паролем', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: testEmail, password: 'NewTestPass123!' });

        if (res.statusCode !== 200) {
            console.error('Логин с новым паролем ошибка:', res.body);
        }

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});