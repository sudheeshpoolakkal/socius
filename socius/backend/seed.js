const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to database
connectDB();

const createAdminUser = async () => {
  try {
    // Delete any existing admin users
    await User.deleteMany({ role: 'admin' });
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@spirtus.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully');
    console.log('Email: admin@spirtus.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();