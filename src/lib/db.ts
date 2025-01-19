import Database from 'better-sqlite3';

const db = new Database('images.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS currency_pairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pair_name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    currency_pair_id INTEGER,
    image_data BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (currency_pair_id) REFERENCES currency_pairs(id)
  );
`);

export const saveCurrencyPair = (pairName: string) => {
  const stmt = db.prepare('INSERT INTO currency_pairs (pair_name) VALUES (?)');
  const result = stmt.run(pairName);
  return result.lastInsertRowid;
};

export const saveImage = (currencyPairId: number, imageData: Blob) => {
  const stmt = db.prepare('INSERT INTO images (currency_pair_id, image_data) VALUES (?, ?)');
  return stmt.run(currencyPairId, imageData);
};

export const getImagesForPair = (currencyPairId: number) => {
  const stmt = db.prepare('SELECT * FROM images WHERE currency_pair_id = ?');
  return stmt.all(currencyPairId);
};

export const getAllPairs = () => {
  const stmt = db.prepare('SELECT * FROM currency_pairs');
  return stmt.all();
};