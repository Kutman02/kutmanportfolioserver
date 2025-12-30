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

// Load environment variables
dotenv.config();

// Handle __dirname for ES modules
let __filename, __dirname;
try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (error) {
  console.error('Error setting up __dirname:', error);
  __dirname = process.cwd();
}

// MongoDB connection with caching for serverless
let cachedConnection = null;

const connectMongoDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Return cached connection if exists
  if (cachedConnection) {
    return cachedConnection;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set. Please set it in your environment variables.');
  }
  
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = connection;
    console.log('✅ Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection middleware for serverless (skip for health check and root)
app.use(async (req, res, next) => {
  // Skip MongoDB connection for health check and root endpoint
  // Check both req.path and req.url to handle Vercel routing
  const path = req.path || req.url;
  if (path === '/api/health' || path === '/health' || path === '/') {
    return next();
  }
  
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectMongoDB();
    }
    next();
  } catch (error) {
    console.error('MongoDB connection error in middleware:', error);
    console.error('Request path:', path);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Database connection failed', 
        message: process.env.NODE_ENV === 'production' 
          ? 'Unable to connect to database' 
          : error.message 
      });
    }
  }
});

// Serve uploaded files (only in non-serverless environments)
// In Vercel serverless, files should be served from external storage (S3, Cloudinary, etc.)
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

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

// Root endpoint - show API information
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Server API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      projects: {
        list: 'GET /api/projects',
        get: 'GET /api/projects/:id',
        create: 'POST /api/projects (requires auth)',
        update: 'PUT /api/projects/:id (requires auth)',
        delete: 'DELETE /api/projects/:id (requires auth)'
      },
      translations: {
        list: 'GET /api/translations',
        get: 'GET /api/translations/:language',
        createOrUpdate: 'POST /api/translations (requires auth)',
        delete: 'DELETE /api/translations/:id (requires auth)'
      },
      skills: {
        list: 'GET /api/skills',
        get: 'GET /api/skills/:id',
        create: 'POST /api/skills (requires auth)',
        update: 'PUT /api/skills/:id (requires auth)',
        delete: 'DELETE /api/skills/:id (requires auth)'
      },
      contacts: {
        list: 'GET /api/contacts',
        get: 'GET /api/contacts/:id',
        create: 'POST /api/contacts (requires auth)',
        update: 'PUT /api/contacts/:id (requires auth)',
        delete: 'DELETE /api/contacts/:id (requires auth)'
      },
      profile: {
        get: 'GET /api/profile',
        update: 'PUT /api/profile (requires auth)'
      },
      resume: {
        get: 'GET /api/resume',
        upload: 'POST /api/resume (requires auth)'
      },
      upload: {
        image: 'POST /api/upload (requires auth)',
        document: 'POST /api/upload-document (requires auth)'
      }
    },
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Global error handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
  }
});

// 404 handler - improved with helpful message
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist. Check the API documentation at the root endpoint (/) for available routes.',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/projects',
      'GET /api/translations',
      'GET /api/skills',
      'GET /api/contacts',
      'GET /api/profile',
      'GET /api/resume'
    ]
  });
});

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 8081;
  
  // For Render and other platforms: Start server immediately
  // MongoDB will connect on first request via middleware
  // This prevents server from crashing if MongoDB is temporarily unavailable
  const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   MongoDB will connect on first request`);
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

  // Optionally try to connect to MongoDB in background (non-blocking)
  // This is just for logging - server is already running
  if (process.env.MONGODB_URI) {
    connectMongoDB()
      .then(async () => {
        console.log('✅ MongoDB pre-connected (server already running)');
        
        // Auto-create admin if it doesn't exist
        try {
          const Admin = (await import('./models/Admin.js')).default;
          const existingAdmin = await Admin.findOne({ username: 'admin' });
          
          if (!existingAdmin) {
            console.log('🔧 No admin found, creating default admin...');
            const admin = new Admin({
              email: 'kutmank9@gmail.com',
              username: 'admin',
              password: 'Beka7422'
            });
            await admin.save();
            console.log('✅ Default admin created:');
            console.log('   Username: admin');
            console.log('   Password: Beka7422');
            console.log('   Email: kutmank9@gmail.com');
          } else {
            console.log('✅ Admin account already exists');
          }
        } catch (error) {
          console.warn('⚠️  Could not check/create admin:', error.message);
        }
      })
      .catch((error) => {
        console.warn('⚠️  MongoDB not available yet, will connect on first request');
        console.warn(`   Error: ${error.message}`);
      });
  } else {
    console.warn('⚠️  MONGODB_URI not set - MongoDB connection will fail on requests');
  }
} else {
  // For serverless: DON'T connect on module load
  // Connection will be established on first request via middleware
  // This prevents function crashes during cold starts
  console.log('Serverless environment detected - MongoDB will connect on first request');
}

export default app;

