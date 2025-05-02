const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.use(authMiddleware.protect);
router.get('/me', authController.getMe);
router.patch('/update-profile', authController.updateProfile);

module.exports = router; 