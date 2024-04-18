const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path'); 
const port = 3000;

// Database connection
const pool = new Pool({
    user: 'tasks_owner', 
    host: 'ep-twilight-queen-a24z353q.eu-central-1.aws.neon.tech', 
    database: 'letsgetfat', 
    password: '************',  
    port: 5432,
});


app.use(express.json());


app.use(express.static(__dirname)); 

// Root route to serve the landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'landingpage.html'));
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


