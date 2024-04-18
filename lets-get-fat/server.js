const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const port = 3000;

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.send('Welcome to Let\'s Get Fat!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
