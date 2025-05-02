const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All admin routes are protected and restricted to admin role
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Admin creation
router.post('/create', adminController.createAdmin);

module.exports = router; 