const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'default_secret_key_for_development',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Sign token and send response with token
exports.createSendToken = (user, statusCode, res) => {
  const token = this.generateToken(user._id);

  // Remove password from output
  const userObject = user.toObject ? user.toObject() : user;
  if (userObject.password) delete userObject.password;

  return res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userObject
    }
  });
}; 