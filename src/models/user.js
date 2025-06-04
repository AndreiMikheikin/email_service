import BaseModel from './base.js';
import pool from '../config/db.js';
import { hashPassword } from '../utils/hash.js';

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async create({ email, password, role = 'user', planId = null }) {
    const passwordHash = await hashPassword(password);

    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, role, plan_id) VALUES (?, ?, ?, ?)`,
      [email, passwordHash, role, planId]
    );

    return result.insertId;
  }

  async findByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0] || null;
  }

  async findById(userId) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    return rows[0] || null;
  }

  async updatePassword(userId, newPassword) {
    const passwordHash = await hashPassword(newPassword);
    const [result] = await pool.query(
      `UPDATE users SET password_hash = ?, reset_token = NULL WHERE id = ?`,
      [passwordHash, userId]
    );
    return result.affectedRows > 0;
  }

  async markEmailConfirmed(userId) {
    const [result] = await pool.query(
      `UPDATE users SET email_confirmed = 1 WHERE id = ?`,
      [userId]
    );
    return result.affectedRows > 0;
  }

  async updateResetToken(userId, token) {
    const [result] = await pool.query(
      `UPDATE users SET reset_token = ? WHERE id = ?`,
      [token, userId]
    );
    return result.affectedRows > 0;
  }

  async clearResetToken(userId) {
    const [result] = await pool.query(
      `UPDATE users SET reset_token = NULL WHERE id = ?`,
      [userId]
    );
    return result.affectedRows > 0;
  }
}


export default new UserModel();