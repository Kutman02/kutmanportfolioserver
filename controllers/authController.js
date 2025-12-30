import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Поиск по username или email
    const admin = await Admin.findOne({
      $or: [
        { username },
        { email: username }
      ]
    });
    
    if (!admin) {
      console.log(`Login attempt failed: Admin "${username}" not found`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for "${username}"`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ Successful login for admin: ${admin.username} (${admin.email})`);
    res.json({ token, username: admin.username, email: admin.email });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  // Регистрация отключена - только один фиксированный админ аккаунт
  return res.status(403).json({ 
    error: 'Registration is disabled. Only one admin account is allowed.' 
  });
};

// Initialize admin account (one-time setup)
export const initAdmin = async (req, res) => {
  try {
    // Check if init secret is provided and matches
    const initSecret = process.env.INIT_SECRET || 'CHANGE_THIS_IN_PRODUCTION';
    const providedSecret = req.body.secret || req.query.secret;
    
    if (!providedSecret || providedSecret !== initSecret) {
      console.log('Init admin attempt failed: Invalid or missing secret');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid initialization secret'
      });
    }

    const email = 'kutmank9@gmail.com';
    const username = 'admin';
    const password = 'Beka7422';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existingAdmin) {
      console.log('Admin already exists, updating password...');
      existingAdmin.email = email;
      existingAdmin.username = username;
      existingAdmin.password = password;
      await existingAdmin.save();
      
      return res.json({ 
        message: 'Admin account updated successfully',
        username,
        email,
        note: 'Password has been reset'
      });
    }

    // Create new admin
    const admin = new Admin({
      email,
      username,
      password
    });
    await admin.save();

    console.log(`✅ Admin account created via init endpoint`);
    res.json({ 
      message: 'Admin account created successfully',
      username,
      email,
      note: 'You can now login with these credentials'
    });
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
    res.status(500).json({ error: error.message });
  }
};

