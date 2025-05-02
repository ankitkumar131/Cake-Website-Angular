const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[Cart Controller] Getting cart for user: ${userId}`);
    
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name price image'
    });

    if (!cart) {
      // Create a new cart if none exists
      console.log(`[Cart Controller] No cart found, creating a new one for user: ${userId}`);
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error(`[Cart Controller] Error getting cart:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;
    
    console.log(`[Cart Controller] Adding product ${productId} to cart for user ${userId}, quantity: ${quantity}`);

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`[Cart Controller] Product not found: ${productId}`);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find cart or create new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      console.log(`[Cart Controller] Creating new cart for user: ${userId}`);
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0
      });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if item exists
      console.log(`[Cart Controller] Updating existing item quantity from ${cart.items[itemIndex].quantity} to ${cart.items[itemIndex].quantity + quantity}`);
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      console.log(`[Cart Controller] Adding new item to cart: ${productId}`);
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    // Recalculate total
    cart.calculateTotalAmount();
    cart.updatedAt = Date.now();
    
    console.log(`[Cart Controller] Saving cart with total amount: ${cart.totalAmount}`);
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error(`[Cart Controller] Error adding to cart:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    
    console.log(`[Cart Controller] Updating cart item quantity for product ${productId}, user ${userId}, new quantity: ${quantity}`);

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate total
    cart.calculateTotalAmount();
    cart.updatedAt = Date.now();
    
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error(`[Cart Controller] Error updating cart item:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    
    console.log(`[Cart Controller] Removing product ${productId} from cart for user ${userId}`);

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );
    
    // Recalculate total
    cart.calculateTotalAmount();
    cart.updatedAt = Date.now();
    
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(200).json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error(`[Cart Controller] Error removing from cart:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log(`[Cart Controller] Clearing cart for user ${userId}`);

    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart items
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = Date.now();
    
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error(`[Cart Controller] Error clearing cart:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
}; 