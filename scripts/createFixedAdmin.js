import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createFixedAdmin = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    const email = 'kutmank9@gmail.com';
    const username = 'admin';
    const password = 'Beka7422';

    // Проверяем, существует ли уже админ
    const existingAdmin = await Admin.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existingAdmin) {
      // Обновляем существующего админа
      existingAdmin.email = email;
      existingAdmin.username = username;
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log(`✅ Admin account updated:`);
      console.log(`   Email: ${email}`);
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
    } else {
      // Создаем нового админа
      const admin = new Admin({
        email,
        username,
        password
      });
      await admin.save();
      console.log(`✅ Admin account created:`);
      console.log(`   Email: ${email}`);
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
    }

    // Удаляем всех остальных админов (если есть)
    const allAdmins = await Admin.find();
    if (allAdmins.length > 1) {
      const otherAdmins = allAdmins.filter(admin => 
        admin.email !== email && admin.username !== username
      );
      if (otherAdmins.length > 0) {
        await Admin.deleteMany({
          _id: { $in: otherAdmins.map(a => a._id) }
        });
        console.log(`✅ Removed ${otherAdmins.length} other admin account(s)`);
      }
    }

    console.log('\n✅ Fixed admin account setup completed!');
    console.log('   Only one admin account exists now.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating fixed admin:', error);
    process.exit(1);
  }
};

createFixedAdmin();

