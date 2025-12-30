import app from '../server.js';

// Vercel serverless function handler
export default (req, res) => {
  return app(req, res);
};

