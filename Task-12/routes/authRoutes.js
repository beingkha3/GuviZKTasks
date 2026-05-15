const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleErrors, registerRules, loginRules } = require('../middleware/validate');

const router = express.Router();

router.post('/register', registerRules, handleErrors, register);
router.post('/login', loginRules, handleErrors, login);
router.get('/me', protect, getMe);

module.exports = router;
