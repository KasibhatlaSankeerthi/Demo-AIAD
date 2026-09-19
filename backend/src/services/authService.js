const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const sql = `
    SELECT id, first_name, last_name, email, role, password_hash, account_status, is_deleted
    FROM users
    WHERE LOWER(email) = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(sql, [normalizedEmail]);
  return rows[0] || null;
};

module.exports = {
  findUserByEmail,
};
