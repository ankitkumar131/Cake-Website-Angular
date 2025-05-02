const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total users
    const userCount = await User.countDocuments();
    
    // Count total products
    const productCount = await Product.countDocuments();
    
    // Count total orders
    const orderCount = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .sort('-createdAt')
      .limit(5);
    
    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort('stock')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: userCount,
          products: productCount,
          orders: orderCount,
          revenue: totalRevenue
        },
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      results: users.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(204).json({
      success: true,
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Create admin user
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Create new admin user
    const newAdmin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    // Remove password from response
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      data: {
        user: adminResponse
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    });
  }
}; 