require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const direction = process.argv[2] || 'up';

if (!['up', 'down'].includes(direction)) {
  console.error('Invalid direction. Use: up | down');
  process.exitCode = 1;
  process.exit();
}

const migrationsDir = path.join(__dirname, '..', 'migrations');

function splitSqlStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function getMigrationFiles(dir, dirFlag) {
  const suffix = dirFlag === 'down' ? '.down.sql' : '.up.sql';
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(suffix))
    .sort();

  return dirFlag === 'down' ? files.reverse() : files;
}

async function run() {
  const conn = await pool.getConnection();
  try {
    const files = getMigrationFiles(migrationsDir, direction);

    if (files.length === 0) {
      console.log(`No ${direction} migrations found.`);
      return;
    }

    for (const file of files) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');

      if (!sql.trim()) {
        continue;
      }

      console.log(`Running ${direction} migration: ${file}`);
      const statements = splitSqlStatements(sql);
      for (const statement of statements) {
        await conn.query(statement);
      }
    }

    console.log(`Migration ${direction} completed.`);
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
