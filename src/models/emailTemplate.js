import pool from '../config/db.js';

class EmailTemplate {
  static async getAll(admin_id) {
    const [rows] = await pool.query(
      'SELECT * FROM email_templates WHERE admin_id = ? ORDER BY created_at DESC',
      [admin_id]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM email_templates WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ admin_id, code, name, subject, html, variables }) {
    const [result] = await pool.query(
      `INSERT INTO email_templates (admin_id, code, name, subject, html, variables)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [admin_id, code, name, subject, html, JSON.stringify(variables)]
    );
    return result.insertId;
  }

  static async update(id, { name, subject, html, variables }) {
    const [result] = await pool.query(
      `UPDATE email_templates SET name = ?, subject = ?, html = ?, variables = ? WHERE id = ?`,
      [name, subject, html, JSON.stringify(variables), id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM email_templates WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

export default EmailTemplate;