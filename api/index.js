import app from '../server.js';

// Vercel serverless function handler
// Express apps are callable directly, but we wrap it to handle errors
export default async (req, res) => {
  try {
    // Express app is a function that handles (req, res)
    return app(req, res);
  } catch (error) {
    console.error('Unhandled error in serverless function:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message
      });
    }
  }
};

