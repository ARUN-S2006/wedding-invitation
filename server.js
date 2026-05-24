const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Render persistent disk path or local fallback
let dbPath;
if (process.env.RENDER) {
  const dbDir = '/opt/render/project/src/data';
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  dbPath = path.join(dbDir, 'rsvps.db');
} else {
  dbPath = path.join(__dirname, 'rsvps.db');
}

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Failed to open SQLite database:', err);
    process.exit(1);
  }
  console.log('SQLite database opened at', dbPath);
});

// Helpful debug logs for deployed environment
console.log('Node env:', process.env.NODE_ENV || 'not set');
console.log('Render env detected:', !!process.env.RENDER);
console.log('Static files served from:', __dirname);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      attendance TEXT NOT NULL,
      guests INTEGER DEFAULT 0,
      message TEXT,
      timestamp TEXT NOT NULL
    )
  `);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/rsvps', (req, res) => {
  const { name, email, attendance, guests, message } = req.body;

  if (!name || !attendance) {
    return res.status(400).json({ error: 'Name and attendance are required.' });
  }

  const timestamp = new Date().toISOString();
  const stmt = db.prepare(
    'INSERT INTO rsvps (name, email, attendance, guests, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)' 
  );

  stmt.run(name, email || 'Not Provided', attendance, guests != null ? guests : 0, message || '', timestamp, function (err) {
    stmt.finalize();

    if (err) {
      console.error('Failed to save RSVP:', err);
      return res.status(500).json({ error: 'Failed to save RSVP response.' });
    }

    res.json({ id: this.lastID, timestamp });
  });
});

app.get('/api/rsvps', (req, res) => {
  db.all(
    'SELECT id, name, email, attendance, guests, message, timestamp FROM rsvps ORDER BY id DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Failed to load RSVP responses:', err);
        return res.status(500).json({ error: 'Failed to load RSVP responses.' });
      }

      res.json(rows);
    }
  );
});

// Temporary debug route: download the SQLite DB file (remove after debugging)
app.get('/download-db', (req, res) => {
  try {
    if (!fs.existsSync(dbPath)) {
      return res.status(404).send('Database file not found');
    }
    res.download(dbPath);
  } catch (err) {
    console.error('Error sending DB file:', err);
    res.status(500).send('Failed to download DB');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
