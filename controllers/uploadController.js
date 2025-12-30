import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;
    
    res.json({ 
      url: fileUrl,
      fullUrl: fullUrl,
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

