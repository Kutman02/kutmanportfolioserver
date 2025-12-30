// Simple test endpoint to verify Vercel is working
export default async (req, res) => {
  try {
    return res.status(200).json({ 
      status: 'OK', 
      message: 'Test endpoint is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({ error: error.message });
  }
};

