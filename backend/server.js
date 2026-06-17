const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'school-portal-secret-key';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = new sqlite3.Database('./school.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    school_id TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    image_path TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

const adminPass = bcrypt.hashSync('admin123', 8);
db.run(`INSERT OR IGNORE INTO users (name,email,password,role,school_id) VALUES (?,?,?,?,?)`,
  ['Admin', 'admin@school.com', adminPass, 'Admin', 'SCH001']);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

app.post('/api/register', async (req, res) => {
  const { name, email, password, role, school_id } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  db.run(`INSERT INTO users (name,email,password,role,school_id) VALUES (?,?,?,?,?)`,
    [name, email, hashed, role, school_id],
    function(err) {
      if (err) return res.status(400).json({ error: 'Email exists' });
      res.status(201).json({ msg: 'User registered' });
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email =?`, [email], (err, user) => {
    if (!user ||!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, name: user.name });
  });
});

app.post('/api/report', auth, upload.single('image'), (req, res) => {
  const { description, category, location, priority } = req.body;
  const image_path = req.file? req.file.filename : null;
  const now = new Date().toISOString();
  db.run(`INSERT INTO issues (user_id,description,category,location,priority,image_path,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`,
    [req.userId, description, category, location, priority, image_path, now, now],
    () => res.status(201).json({ msg: 'Issue reported' }));
});

app.get('/api/issues', auth, (req, res) => {
  db.all(`SELECT * FROM issues ORDER BY created_at DESC`, [], (err, rows) => res.json(rows));
});

app.put('/api/issues/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const now = new Date().toISOString();
  db.run(`UPDATE issues SET status=?, updated_at=? WHERE id=?`,
    [status, now, req.params.id], () => res.json({ msg: 'Status updated' }));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
