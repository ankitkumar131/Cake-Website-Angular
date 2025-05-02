const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All cart routes are protected
router.use(authMiddleware.protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch('/update', cartController.updateCartItem);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router; 