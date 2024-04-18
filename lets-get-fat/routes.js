// User login
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (await bcrypt.compare(password, user.password)) {
          res.send('Welcome ' + user.name);
        } else {
          res.status(401).send('Incorrect password');
        }
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  
  // User registration
app.post('/register', async (req, res) => {
    try {
      const { name, username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query('INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)', [name, username, email, hashedPassword]);
      res.status(201).send('User registered successfully');
    } catch (err) {
      if (err.constraint === 'users_email_key') {
        res.status(400).send('User already exists');
      } else {
        console.error(err);
        res.status(500).send('Server error');
      }
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });


  // Get user profile
app.get('/profile', async (req, res) => {
    try {
      const { username } = req.body;
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  
  // Update user profile
app.put('/profile', async (req, res) => {
    try {
      const { username, height, age, currentWeight, desiredWeight, dietPreference } = req.body;
      const result = await pool.query('UPDATE users SET height = $1, age = $2, current_weight = $3, desired_weight = $4, diet_preference = $5 WHERE username = $6', [height, age, currentWeight, desiredWeight, dietPreference, username]);
      res.send('Profile updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  

  // Get meal plan
app.get('/mealplan', async (req, res) => {
    try {
      const { username } = req.body;
      const result = await pool.query('SELECT * FROM meal_plans WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        const mealPlan = result.rows[0];
        res.json(mealPlan);
      } else {
        res.status(404).send('Meal plan not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  

  // Get exercise plan
app.get('/exerciseplan', async (req, res) => {
    try {
      const { username } = req.body;
      const result = await pool.query('SELECT * FROM exercise_plans WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        const exercisePlan = result.rows[0];
        res.json(exercisePlan);
      } else {
        res.status(404).send('Exercise plan not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  

  // Get progress
app.get('/progress', async (req, res) => {
    try {
      const { username } = req.body;
      const result = await pool.query('SELECT * FROM progress WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        const progress = result.rows[0];
        res.json(progress);
      } else {
        res.status(404).send('Progress not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Update progress
  app.put('/progress', async (req, res) => {
    try {
      const { username, food, exercise } = req.body;
      const result = await pool.query('UPDATE progress SET food = $1, exercise = $2 WHERE username = $3', [food, exercise, username]);
      res.send('Progress updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  