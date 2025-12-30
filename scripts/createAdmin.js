import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB\n');

    // Проверяем существующих админов
    const existingAdmins = await Admin.find();
    if (existingAdmins.length > 0) {
      console.log('Existing admins:');
      existingAdmins.forEach(admin => {
        console.log(`  - ${admin.username}`);
      });
      console.log('');
    }

    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password: ');

    if (!username || !password) {
      console.log('Username and password are required!');
      process.exit(1);
    }

    // Проверяем, существует ли уже такой админ
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`\nAdmin with username "${username}" already exists!`);
      process.exit(1);
    }

    // Создаем нового админа
    const admin = new Admin({ username, password });
    await admin.save();

    console.log(`\n✅ Admin "${username}" created successfully!`);
    console.log('\nYou can now login at: http://localhost:3000/admin/login');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
};

createAdmin();

