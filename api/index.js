// Vercel serverless function handler
// Import app - if import fails, Vercel will show the error in logs
import appModule from '../server.js';

// Get the app (handle both default and named exports)
const app = appModule.default || appModule;

if (!app) {
  throw new Error('Failed to import Express app from server.js - app is null or undefined');
}

console.log('✅ Express app loaded successfully');
console.log('App type:', typeof app);

export default async (req, res) => {
  try {
    // Express app is callable as a function: app(req, res)
    return app(req, res);
  } catch (error) {
    console.error('❌ Unhandled error in request handler:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' 
          ? 'An error occurred while processing your request' 
          : error.message,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack,
          name: error.name
        })
      });
    } else {
      console.error('Cannot send error response - headers already sent');
    }
  }
};

