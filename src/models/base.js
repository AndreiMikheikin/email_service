//src\models\base.js

import pool from '../config/db.js';

export default class BaseModel {
  constructor(tableName) {
    this.table = tableName;
  }

  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async deleteById(id) {
    const [result] = await pool.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}