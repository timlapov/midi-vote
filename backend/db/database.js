// Initialisation de la base de données SQLite
// Crée les tables proposals et participants si elles n'existent pas

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'midivote.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vote_day TEXT NOT NULL,
      restaurant_name TEXT NOT NULL,
      cuisine_type TEXT NOT NULL,
      google_maps_link TEXT NOT NULL,
      menu_link TEXT,
      departure_time TEXT NOT NULL,
      meal_format TEXT NOT NULL CHECK(meal_format IN ('sur_place', 'a_emporter')),
      comment TEXT,
      author_id TEXT NOT NULL,
      author_first_name TEXT NOT NULL,
      author_last_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_proposals_vote_day ON proposals(vote_day);

    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proposal_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT,
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
      UNIQUE(proposal_id, user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
  `);
}

module.exports = { getDb };
