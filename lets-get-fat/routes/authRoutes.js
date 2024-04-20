const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  

// Use actual login and register methods from authController
router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/', (req, res) => {
    res.render('index');
});

// Route for displaying the user profile
router.get('/profile', authController.showProfile);

// Route for updating user profile information
router.post('/update-profile', authController.updateProfile);

router.post('/update-diet', authController.updateDiet);

router.post('/update-weight', authController.updateWeight);

router.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        console.log('Error destroying session: ', err);
      }
      res.redirect('/'); // Redirect to the home/login page
    });
  });
  


module.exports = router;
