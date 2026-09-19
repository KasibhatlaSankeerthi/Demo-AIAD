const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, first_name, last_name, email, role, password_hash, account_status, is_deleted
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(sql, [email]);
  return rows[0] || null;
};

module.exports = {
  findUserByEmail,
};
