const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

// Garante que o diretório data exista
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_FILE || path.join(dataDir, 'cifra_cesar.sqlite');
const db = new DatabaseSync(dbPath);

// Habilita foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Inicializa tabelas
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password TEXT NOT NULL,
      callsign TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cipher_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT UNIQUE NOT NULL,
      step INTEGER NOT NULL,
      mode TEXT DEFAULT '36',
      usado INTEGER DEFAULT 0 NOT NULL,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      used_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cipher_hash ON cipher_keys(hash);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `);
}

initDatabase();

module.exports = db;

