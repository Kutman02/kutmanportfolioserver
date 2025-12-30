import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

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
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for "${username}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`Successful login for admin: ${admin.username} (${admin.email})`);
    res.json({ token, username: admin.username, email: admin.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  // Регистрация отключена - только один фиксированный админ аккаунт
  return res.status(403).json({ 
    error: 'Registration is disabled. Only one admin account is allowed.' 
  });
};

