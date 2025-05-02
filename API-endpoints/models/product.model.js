const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: [String],
    required: [true, 'At least one category is required'],
    enum: {
      values: ['cakes', 'muffins', 'pastries', 'cupcakes', 'cookies', 'breads', 'featured'],
      message: '{VALUE} is not a valid category'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  ingredients: {
    type: [String]
  },
  nutrition: {
    calories: Number,
    fat: Number,
    carbs: Number,
    protein: Number
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 