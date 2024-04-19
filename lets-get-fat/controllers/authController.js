const bcrypt = require('bcrypt');
const db = require('../config/db');


// Register User
exports.register = async (req, res) => {
    const { name, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userExists = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (userExists.rows.length > 0) {
            return res.render('index', { registerErrorMessage: 'Sorry, but you are already a client.' });
        }

        await db.query('INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)', [name, username, email, hashedPassword]);
        res.send(`Welcome ${name}`);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('index', { registerErrorMessage: 'Error in registration process' });
    }
};


// Login User
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.render('index', { errorMessage: 'Sorry, that account does not exist.' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.render('index', { errorMessage: 'Sorry, incorrect credentials.' });
        }

        res.send(`Welcome back, ${user.name}`);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('index', { errorMessage: 'Login error' });
    }
};



