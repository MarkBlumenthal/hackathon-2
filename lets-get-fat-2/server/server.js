const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Route for landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// #*********************************************************************************************************#



const { Pool } = require('pg');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Connect to PostgreSQL
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL', err.stack);
    } else {
        console.log('Connected to PostgreSQL');

        // Create tables
        const createTables = async () => {
            // Users table
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

            // Meal plans table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS meal_plans (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    meal VARCHAR(100),
                    day_of_week VARCHAR(50)
                );
            `);

            // Exercise plans table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS exercise_plans (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    exercise VARCHAR(100),
                    day_of_week VARCHAR(50)
                );
            `);

            // Progress table
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
        };

        createTables();
    }
});

// #***********************************************************************************************#


const bcrypt = require('bcrypt');
const saltRounds = 10;

// Route for user registration
app.post('/register', async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.body.name, req.body.username, req.body.email, hashedPassword]
        );

        res.status(201).json({ userId: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        // Get the user from the database
        const result = await pool.query(
            'SELECT id, password FROM users WHERE username = $1',
            [req.body.username]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Check the password
        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        res.json({ userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
});



// #**************************************************************************************************#


// Route for updating user details
app.put('/user/:id', async (req, res) => {
    try {
        // Update the user's details in the database
        await pool.query(
            'UPDATE users SET height = $1, age = $2, current_weight = $3, desired_weight = $4, diet = $5 WHERE id = $6',
            [req.body.height, req.body.age, req.body.current_weight, req.body.desired_weight, req.body.diet, req.params.id]
        );

        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user\'s details' });
    }
});

// Route for getting user details
app.get('/user/:id', async (req, res) => {
    try {
        // Get the user's details from the database
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting the user\'s details' });
    }
});




// #****************************************************************************************************#


// Route for getting meal plans
app.get('/user/:id/meal-plans', async (req, res) => {
    try {
        // Get the user's meal plans from the database
        const result = await pool.query(
            'SELECT * FROM meal_plans WHERE user_id = $1',
            [req.params.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting the meal plans' });
    }
});

// Route for getting exercise plans
app.get('/user/:id/exercise-plans', async (req, res) => {
    try {
        // Get the user's exercise plans from the database
        const result = await pool.query(
            'SELECT * FROM exercise_plans WHERE user_id = $1',
            [req.params.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting the exercise plans' });
    }
});

// Route for getting progress
app.get('/user/:id/progress', async (req, res) => {
    try {
        // Get the user's progress from the database
        const result = await pool.query(
            'SELECT * FROM progress WHERE user_id = $1',
            [req.params.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while getting the progress' });
    }
});


// #******************************************************************************************************#



// Route for updating meal plan
app.post('/user/:id/meal-plan', async (req, res) => {
    try {
        // Insert the new meal plan into the database
        await pool.query(
            'INSERT INTO meal_plans (user_id, meal, day_of_week) VALUES ($1, $2, $3)',
            [req.params.id, req.body.meal, req.body.day_of_week]
        );

        res.status(201).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the meal plan' });
    }
});



// Route for updating exercise plan
app.post('/user/:id/exercise-plan', async (req, res) => {
    try {
        // Insert the new exercise plan into the database
        await pool.query(
            'INSERT INTO exercise_plans (user_id, exercise, day_of_week) VALUES ($1, $2, $3)',
            [req.params.id, req.body.exercise, req.body.day_of_week]
        );

        res.status(201).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the exercise plan' });
    }
});



// Route for updating progress
app.post('/user/:id/progress', async (req, res) => {
    try {
        // Insert the new progress entry into the database
        await pool.query(
            'INSERT INTO progress (user_id, date, weight, meal, exercise) VALUES ($1, $2, $3, $4, $5)',
            [req.params.id, req.body.date, req.body.weight, req.body.meal, req.body.exercise]
        );

        res.status(201).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the progress' });
    }
});


// #**************************************************************************************************#



