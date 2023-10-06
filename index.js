const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Create a MySQL database connection
const db = mysql.createConnection({
  host: '34.172.244.200',
  user: 'root',
  password: 'S]8xYoO4z;G|~Uh.',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set the view engine to EJS for rendering HTML templates
app.set('view engine', 'ejs');

// Define a route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});