const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());

const port = 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Open SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'db', 'quiz.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database connected successfully.');
  }
});



// Define your routes and handlers here
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS UserScore (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT,
    score INTEGER
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('UserScore table is ready.');
  }
});

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// Route to add a user score
app.post('/api/save-user-score', (req, res) => {
  const { userName, correctAnswersCount } = req.body;
  const insertQuery = `INSERT INTO UserScore (userName, score) VALUES (?, ?)`;

  db.run(insertQuery, [userName, correctAnswersCount], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to save user score.' });
    } else {
      res.status(201).json({ message: 'User score saved successfully.' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
