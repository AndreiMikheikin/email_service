import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

const testAdminEmail = process.env.SMTP_USER;
const testAdminPassword = 'AdminPass123!';
const clientEmail = 'client@pool.test';
const clientPassword = 'ClientPass123!';
let adminToken = '';
let createdUserId = null;

beforeAll(async () => {
    // Чистим админа и пул клиентов
    await pool.query('DELETE FROM users WHERE email = ?', [testAdminEmail]);
    await pool.query('DELETE FROM pool_of_users WHERE email = ?', [clientEmail]);

    // Регистрируем админа
    await request(app)
        .post('/api/users/register')
        .send({ email: testAdminEmail, password: testAdminPassword });

    // Подтверждаем email
    await pool.query('UPDATE users SET email_confirmed = 1 WHERE email = ?', [testAdminEmail]);

    // Получаем токен
    const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email: testAdminEmail, password: testAdminPassword });

    adminToken = loginRes.body.token;
});

afterAll(async () => {
    // Чистим
    await pool.query('DELETE FROM pool_of_users WHERE email = ?', [clientEmail]);
    await pool.query('DELETE FROM users WHERE email = ?', [testAdminEmail]);
    await pool.end();
});

describe('Pool of Users', () => {
    it('создаёт client-пользователя', async () => {
        const res = await request(app)
            .post('/api/adminDashboard')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ email: clientEmail, password: clientPassword });

        expect(res.statusCode).toBe(201);
        expect(res.body.userId).toBeDefined();
        createdUserId = res.body.userId;
    });

    it('возвращает список client-пользователей', async () => {
        const res = await request(app)
            .get('/api/adminDashboard')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users.find(u => u.email === clientEmail)).toBeDefined();
    });

    it('обновляет email client-пользователя', async () => {
        const res = await request(app)
            .put(`/api/adminDashboard/${createdUserId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ email: 'client-updated@pool.test' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/обновлён/i);
    });

    it('удаляет client-пользователя', async () => {
        const res = await request(app)
            .delete(`/api/adminDashboard/${createdUserId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/удалён/i);
    });
});