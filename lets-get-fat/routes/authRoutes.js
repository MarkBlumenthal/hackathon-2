const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Adjust the path if necessary

// Use actual login and register methods from authController
router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;
