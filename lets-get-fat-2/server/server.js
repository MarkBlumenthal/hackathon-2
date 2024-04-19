require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Environment variables for database connection
const dbConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Note: For production, you should have a proper SSL configuration
    }
};

const pool = new Pool(dbConfig);

// Middleware to serve static files correctly
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Route for landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Connect to PostgreSQL
pool.connect(err => {
    if (err) {
        console.error('Error connecting to PostgreSQL', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
        createTables();
    }
});

// Function to create tables if they do not exist
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                username VARCHAR(100) UNIQUE,
                email VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                height INTEGER,
                age INTEGER,
                current_weight INTEGER,
                desired_weight INTEGER,
                diet VARCHAR(50)
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS meal_plans (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                meal VARCHAR(100),
                day_of_week VARCHAR(50)
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exercise_plans (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                exercise VARCHAR(100),
                day_of_week VARCHAR(50)
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                date DATE,
                weight INTEGER,
                meal VARCHAR(100),
                exercise VARCHAR(100)
            );
        `);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Failed to create tables', err);
    }
};

// Routes for user authentication and management
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.body.name, req.body.username, req.body.email, hashedPassword]
        );
        res.status(201).json({ userId: result.rows[0].id });
    } catch (err) {
        console.error('Registration error', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, password FROM users WHERE username = $1',
            [req.body.username]
        );
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        res.json({ userId: user.id });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});

// Route for getting and updating user details
app.get('/user/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        if (!rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Get user details error', err);
        res.status(500).json({ error: 'Failed to retrieve user details' });
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const { height, age, current_weight, desired_weight, diet } = req.body;
        await pool.query(
            'UPDATE users SET height = $1, age = $2, current_weight = $3, desired_weight = $4, diet = $5 WHERE id = $6',
            [height, age, current_weight, desired_weight, diet, req.params.id]
        );
        res.status(204).send();
    } catch (err) {
        console.error('Update user details error', err);
        res.status(500).json({ error: 'Failed to update user details' });
    }
});

// Routes for meal plans and exercise plans
app.get('/user/:id/meal-plans', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM meal_plans WHERE user_id = $1', [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error('Get meal plans error', err);
        res.status(500).json({ error: 'Failed to retrieve meal plans' });
    }
});

app.post('/user/:id/meal-plan', async (req, res) => {
    try {
        const { meal, day_of_week } = req.body;
        await pool.query(
            'INSERT INTO meal_plans (user_id, meal, day_of_week) VALUES ($1, $2, $3)',
            [req.params.id, meal, day_of_week]
        );
        res.status(201).send();
    } catch (err) {
        console.error('Update meal plan error', err);
        res.status(500).json({ error: 'Failed to update the meal plan' });
    }
});

app.get('/user/:id/exercise-plans', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM exercise_plans WHERE user_id = $1', [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error('Get exercise plans error', err);
        res.status(500).json({ error: 'Failed to retrieve exercise plans' });
    }
});

app.post('/user/:id/exercise-plan', async (req, res) => {
    try {
        const { exercise, day_of_week } = req.body;
        await pool.query(
            'INSERT INTO exercise plans (user_id, exercise, day_of_week) VALUES ($1, $2, $3)',
            [req.params.id, exercise, day_of_week]
        );
        res.status(201).send();
    } catch (err) {
        console.error('Update exercise plan error', err);
        res.status(500).json({ error: 'Failed to update the exercise plan' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


