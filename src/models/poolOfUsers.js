// src\models\poolOfUsers.js

import pool from '../config/db.js';
import { hashPassword } from '../utils/hash.js';

class PoolOfUser {
  static async create({ admin_id, email, password }) {
    const password_hash = await hashPassword(password);
    const [result] = await pool.query(
      `INSERT INTO pool_of_users (admin_id, email, password_hash) VALUES (?, ?, ?)`,
      [admin_id, email, password_hash]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM pool_of_users WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  static async findAllByAdminId(admin_id) {
    const [rows] = await pool.query(
      `SELECT id, email, created_at, updated_at FROM pool_of_users WHERE admin_id = ? ORDER BY created_at DESC`,
      [admin_id]
    );
    return rows;
  }

  static async deleteById(id, admin_id) {
    const [result] = await pool.query(
      `DELETE FROM pool_of_users WHERE id = ? AND admin_id = ?`,
      [id, admin_id]
    );
    return result.affectedRows > 0;
  }

  static async updateById({ id, admin_id, email, password }) {
    const fields = [];
    const values = [];

    if (email) {
      fields.push('email = ?');
      values.push(email);
    }

    if (password) {
      const hash = await hashPassword(password);
      fields.push('password_hash = ?');
      values.push(hash);
    }

    if (fields.length === 0) return false;

    values.push(id, admin_id);

    const [result] = await pool.query(
      `UPDATE pool_of_users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ? AND admin_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }
}

export default PoolOfUser;