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

        const newUser = await db.query('INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [name, username, email, hashedPassword]);
        req.session.user = newUser.rows[0]; // Store user information in session
        res.redirect('/profile'); // Redirect to profile page after registration
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

        // Correctly place session and redirect inside the try block
        req.session.user = user;  // Store user information in session
        res.redirect('/profile');  // Redirect to profile page
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('index', { errorMessage: 'Login error' });
    }
};


  exports.showProfile = async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    try {
        const weightData = await db.query(
            'SELECT weight, updated_at FROM weight_history WHERE user_id = $1 ORDER BY updated_at ASC',
            [req.session.user.id]
        );
        res.render('profile', {
            user: req.session.user,
            weightUpdates: weightData.rows
        });
    } catch (error) {
        console.error('Failed to retrieve weight data:', error);
        res.status(500).send('Failed to load weight data.');
    }
};

  
// Update user profile
exports.updateProfile = async (req, res) => {
    const { id, age, height, current_weight, desired_weight } = req.body;
    try {
      await db.query(
        'UPDATE users SET age = $1, height = $2, current_weight = $3, desired_weight = $4 WHERE id = $5',
        [age, height, current_weight, desired_weight, id]
      );
      res.json({ message: 'Profile updated successfully' }); // Send JSON response
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  };

  
  exports.updateDiet = async (req, res) => {
    const { id, diet } = req.body;
    try {
      await db.query('UPDATE users SET diet_preference = $1 WHERE id = $2', [diet, id]);
      res.json({ message: 'Diet preference updated successfully' });
    } catch (error) {
      console.error('Error updating diet preference:', error);
      res.status(500).json({ error: 'Failed to update diet preference' });
    }
  };
  


exports.updateWeight = async (req, res) => {
  const { id, current_weight } = req.body;
  try {
    // Update the current weight in the users table
    await db.query('UPDATE users SET current_weight = $1 WHERE id = $2', [current_weight, id]);

    // Fetch updated weight history for the graph
    const weightUpdates = await db.query('SELECT weight, updated_at FROM weight_history WHERE user_id = $1 ORDER BY updated_at ASC', [id]);
    
    // Redirect back or send JSON with data for the graph
    res.json({ weightUpdates: weightUpdates.rows }); // Send updated weight data
  } catch (error) {
    console.error('Error updating current weight:', error);
    res.status(500).send('Failed to update weight');
  }
};
