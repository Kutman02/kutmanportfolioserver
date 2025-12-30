import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import translationRoutes from './routes/translations.js';
import uploadRoutes from './routes/upload.js';
import uploadDocumentRoutes from './routes/uploadDocument.js';
import skillRoutes from './routes/skills.js';
import contactRoutes from './routes/contacts.js';
import profileRoutes from './routes/profile.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/upload-document', uploadDocumentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
const PORT = process.env.PORT || 8081;

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`   Please either:`);
        console.error(`   1. Stop the process using port ${PORT}`);
        console.error(`   2. Change PORT in .env file to another port (e.g., 8082)`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('   Please make sure MongoDB is running and MONGODB_URI is correct');
    console.error(`   Current MONGODB_URI: ${MONGODB_URI}`);
    process.exit(1);
  });

export default app;

