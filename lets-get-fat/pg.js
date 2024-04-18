const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const port = 3000;

// Database connection
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('Welcome to Let\'s Get Fat!');
});


