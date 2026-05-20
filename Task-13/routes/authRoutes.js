const express = require('express');
const { forgotPassword, resetPassword, verifyResetToken } = require('../controllers/authController');
const { handleErrors, forgotPasswordRules, resetPasswordRules } = require('../middleware/validate');

const router = express.Router();

router.post('/forgot-password', forgotPasswordRules, handleErrors, forgotPassword);
router.get('/reset-password/:token', verifyResetToken);
router.post('/reset-password/:token', resetPasswordRules, handleErrors, resetPassword);

module.exports = router;
