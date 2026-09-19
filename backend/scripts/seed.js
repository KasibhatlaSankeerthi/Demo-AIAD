require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const seedsDir = path.join(__dirname, '..', 'seeds');

function splitSqlStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function run() {
  const conn = await pool.getConnection();
  try {
    const files = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No seed files found.');
      return;
    }

    for (const file of files) {
      const sqlPath = path.join(seedsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');

      if (!sql.trim()) {
        continue;
      }

      console.log(`Running seed file: ${file}`);
      const statements = splitSqlStatements(sql);
      for (const statement of statements) {
        await conn.query(statement);
      }
    }

    console.log('Seed completed.');
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
