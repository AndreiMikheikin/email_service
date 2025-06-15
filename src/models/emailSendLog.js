import pool from '../config/db.js';

class EmailSendLog {
  static async log({ admin_id, user_id, recipient_email }) {
    const [result] = await pool.query(
      `INSERT INTO email_send_logs (admin_id, user_id, recipient_email) VALUES (?, ?, ?)`,
      [admin_id, user_id, recipient_email]
    );
    return result.insertId;
  }

  static async countToday(admin_id) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM email_send_logs 
       WHERE admin_id = ? AND DATE(sent_at) = CURDATE()`,
      [admin_id]
    );
    return rows[0].count;
  }

  static async countThisMonth(admin_id) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM email_send_logs 
       WHERE admin_id = ? AND MONTH(sent_at) = MONTH(CURDATE()) AND YEAR(sent_at) = YEAR(CURDATE())`,
      [admin_id]
    );
    return rows[0].count;
  }
}

export default EmailSendLog;