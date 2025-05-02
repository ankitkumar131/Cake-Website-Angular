const User = require('../models/user.model');

// Function to create initial admin user
const createInitialAdmin = async () => {
  try {
    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cakewebsite.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Create new admin user
      const adminData = {
        name: 'Admin User',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin1234',
        role: 'admin'
      };

      await User.create(adminData);
      console.log('Initial admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};

module.exports = createInitialAdmin; 