import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Translation from '../models/Translation.js';
import Skill from '../models/Skill.js';
import Contact from '../models/Contact.js';
import Profile from '../models/Profile.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const initData = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Загрузка проектов из JSON
    const projectsPath = path.join(__dirname, '../../client/src/assets/projects.json');
    if (fs.existsSync(projectsPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      const existingProjects = await Project.find();
      
      if (existingProjects.length === 0 && projectsData.projects) {
        // Преобразуем id в _id для MongoDB
        const projectsToInsert = projectsData.projects.map(project => ({
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          image: project.image,
          images: project.images || [],
          youtubeVideo: project.youtubeVideo || '',
          github: project.github,
          demo: project.demo,
          features: project.features || []
        }));
        
        await Project.insertMany(projectsToInsert);
        console.log(`Inserted ${projectsToInsert.length} projects`);
      } else {
        console.log('Projects already exist in database');
      }
    }

    // Загрузка переводов из JSON (если файлы существуют)
    const enPath = path.join(__dirname, '../../client/src/locales/en/translation.json');
    const ruPath = path.join(__dirname, '../../client/src/locales/ru/translation.json');

    let ruData = null;

    if (fs.existsSync(enPath)) {
      const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      const existingEn = await Translation.findOne({ language: 'en' });
      
      if (!existingEn) {
        await Translation.create({ language: 'en', data: enData });
        console.log('Inserted English translations');
      } else {
        console.log('English translations already exist in database');
      }
    } else {
      console.log('⚠️  English translation file not found. Skipping import.');
      console.log('   You can import translations later through admin panel.');
    }

    if (fs.existsSync(ruPath)) {
      ruData = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
      const existingRu = await Translation.findOne({ language: 'ru' });
      
      if (!existingRu) {
        await Translation.create({ language: 'ru', data: ruData });
        console.log('Inserted Russian translations');
      } else {
        console.log('Russian translations already exist in database');
      }
    } else {
      console.log('⚠️  Russian translation file not found. Skipping import.');
      console.log('   You can import translations later through admin panel.');
    }

    // Загрузка навыков из переводов
    if (ruData && ruData.skills?.categories) {
      const skillsData = ruData.skills.categories;
      const existingSkills = await Skill.find();
      
      if (existingSkills.length === 0 && Object.keys(skillsData).length > 0) {
        const skillsToInsert = Object.entries(skillsData).map(([category, data], index) => ({
          category,
          title: data.title || category,
          items: data.items || [],
          order: index
        }));
        
        await Skill.insertMany(skillsToInsert);
        console.log(`Inserted ${skillsToInsert.length} skill categories`);
      } else {
        console.log('Skills already exist in database');
      }
    } else {
      console.log('No skills data found in translations');
    }

    // Загрузка контактов (из Contact компонента)
    const existingContacts = await Contact.find();
    if (existingContacts.length === 0) {
      const contactsToInsert = [
        { platform: 'Email', url: 'mailto:kutmank9@gmail.com', icon: 'FaEnvelope', order: 0 },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/kutmanbek-kubanychbek-uulu-623660303/', icon: 'FaLinkedin', order: 1 },
        { platform: 'GitHub', url: 'https://github.com/Kutman02', icon: 'FaGithub', order: 2 },
        { platform: 'Telegram', url: 'https://t.me/Kutmanbek_kg', icon: 'FaTelegram', order: 3 }
      ];
      
      await Contact.insertMany(contactsToInsert);
      console.log(`Inserted ${contactsToInsert.length} contacts`);
    } else {
      console.log('Contacts already exist in database');
    }

    // Загрузка профиля
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      const profileData = ruData?.img || {};
      await Profile.create({
        profilePhoto: profileData.profilePhoto || 'https://keephere.ru/get/HNAULXgZxfX/o/photo.jpg',
        profilePhotoAlt: profileData.profilePhotoAlt || 'Profile photo'
      });
      console.log('Inserted profile data');
    } else {
      console.log('Profile already exists in database');
    }

    console.log('Data initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
};

initData();

