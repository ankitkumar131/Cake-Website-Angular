const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;
    
    console.log(`[Order Controller] Creating order for user: ${userId}`);
    console.log(`[Order Controller] Shipping address:`, shippingAddress);
    console.log(`[Order Controller] Payment method:`, paymentMethod);

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name price image stock'
    });

    if (!cart || cart.items.length === 0) {
      console.log(`[Order Controller] Cart is empty for user: ${userId}`);
      return res.status(400).json({
        success: false,
        message: 'Cart is empty, cannot create order'
      });
    }

    console.log(`[Order Controller] Found cart with ${cart.items.length} items and total amount: ${cart.totalAmount}`);

    // Check product stock availability
    for (const item of cart.items) {
      const product = item.product;
      
      if (product.stock < item.quantity) {
        console.log(`[Order Controller] Not enough stock for product ${product._id}. Available: ${product.stock}, Requested: ${item.quantity}`);
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          product: product._id
        });
      }
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price
    }));
    
    // Normalize payment method type to match enum values
    let normalizedPaymentType = paymentMethod.type;
    if (paymentMethod.type === 'creditCard') {
      normalizedPaymentType = 'credit_card';
    }

    // Create new order
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod: {
        type: normalizedPaymentType,
        last4: paymentMethod.last4
      },
      orderDate: Date.now()
    });
    
    console.log(`[Order Controller] Created new order with ID: ${newOrder._id}`);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
      console.log(`[Order Controller] Updated stock for product ${item.product._id}, reduced by ${item.quantity}`);
    }

    // Clear the cart
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = Date.now();
    await cart.save();
    console.log(`[Order Controller] Cleared cart for user: ${userId}`);

    // Populate order products
    await newOrder.populate({
      path: 'items.product',
      select: 'name price image'
    });

    res.status(201).json({
      success: true,
      data: {
        order: newOrder
      }
    });
  } catch (error) {
    console.error(`[Order Controller] Error creating order:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[Order Controller] Getting orders for user: ${userId}`);
    
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price image'
      })
      .sort('-createdAt');
    
    console.log(`[Order Controller] Found ${orders.length} orders for user: ${userId}`);

    res.status(200).json({
      success: true,
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error(`[Order Controller] Error getting orders:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(`[Order Controller] Getting order: ${orderId}`);
    
    const order = await Order.findById(orderId)
      .populate({
        path: 'items.product',
        select: 'name price image'
      });

    if (!order) {
      console.log(`[Order Controller] Order not found: ${orderId}`);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the requesting user or is an admin
    if (order.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      console.log(`[Order Controller] Unauthorized access to order: ${orderId} by user: ${req.user._id}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error(`[Order Controller] Error getting order:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    console.log(`[Order Controller] Updating order status for order: ${orderId} to: ${status}`);
    
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    ).populate({
      path: 'items.product',
      select: 'name price image'
    });

    if (!order) {
      console.log(`[Order Controller] Order not found: ${orderId}`);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error(`[Order Controller] Error updating order status:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    console.log(`[Order Controller] Getting all orders`);
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'items.product',
        select: 'name price image'
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();
    
    console.log(`[Order Controller] Found ${orders.length} orders, total: ${total}`);

    res.status(200).json({
      success: true,
      results: orders.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error(`[Order Controller] Error getting all orders:`, error);
    res.status(400).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
}; 