const bcrypt = require('bcrypt');
const db = require('../config/db');



exports.register = async (req, res) => {
  const { name, username, email, password, weight } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExists = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userExists.rows.length > 0) {
        return res.render('index', { registerErrorMessage: 'Username or email already exists.' });
    }

    const newUser = await db.query(
        'INSERT INTO users (name, username, email, password, current_weight, starting_weight) VALUES ($1, $2, $3, $4, $5, $5) RETURNING *',
        [name, username, email, hashedPassword, weight]
    );

    req.session.user = newUser.rows[0];
    res.redirect('/profile');
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

  

exports.updateProfile = async (req, res) => {
  const { id, age, height, current_weight, desired_weight } = req.body;
  try {
      const userDetails = await db.query('SELECT starting_weight FROM users WHERE id = $1', [id]);
      let startingWeight = userDetails.rows[0].starting_weight;

      if (!startingWeight) { // Check if starting_weight has never been set
          startingWeight = current_weight; // Set starting weight to current weight on first update
          await db.query('UPDATE users SET starting_weight = $1 WHERE id = $2', [startingWeight, id]);
      }

      await db.query(
          'UPDATE users SET age = $1, height = $2, current_weight = $3, desired_weight = $4 WHERE id = $5',
          [age, height, current_weight, desired_weight, id]
      );
      res.json({ message: 'Profile updated successfully', startingWeight: startingWeight }); // Include startingWeight in response for client-side logic
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
    // Fetch the current starting_weight from the database to check if it needs to be set
    const userDetails = await db.query('SELECT starting_weight, desired_weight FROM users WHERE id = $1', [id]);
    let { starting_weight, desired_weight } = userDetails.rows[0];

    // If starting_weight has never been set, set it now along with current_weight
    if (starting_weight === null) {
      await db.query('UPDATE users SET current_weight = $1, starting_weight = $1 WHERE id = $2', [current_weight, id]);
      starting_weight = current_weight; // Since this is the first update, set starting weight to current weight
    } else {
      // Only update current_weight
      await db.query('UPDATE users SET current_weight = $1 WHERE id = $2', [current_weight, id]);
    }

    // Send the details back for graph update
    res.json({
      startingWeight: starting_weight,
      updatedWeight: current_weight,
      desiredWeight: desired_weight
    });
  } catch (error) {
    console.error('Error updating current weight:', error);
    res.status(500).send('Failed to update weight');
  }
};









