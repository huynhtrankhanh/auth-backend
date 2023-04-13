const express = require('express');
const argon2 = require('argon2');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./users.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await argon2.hash(password);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error saving user to database');
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving user from database');
    } else if (!row) {
      res.status(401).send('User not found');
    } else {
      const isValidPassword = await argon2.verify(row.password, password);
      if (isValidPassword) {
        res.status(200).send('Authentication successful');
      } else {
        res.status(401).send('Authentication failed');
      }
    }
  });
});

module.exports = app;
