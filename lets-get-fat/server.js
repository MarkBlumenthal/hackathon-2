const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path'); 
const port = 3000;

app.use(express.json()); // for parsing application/json

// Serve static files from the "lets-get-fat" directory
app.use(express.static(path.join(__dirname, 'lets-get-fat'))); 

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'lets-get-fat', 'landingpage.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
