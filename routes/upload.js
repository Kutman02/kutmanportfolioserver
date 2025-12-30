import express from 'express';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.delete('/:filename', authenticateToken, deleteFile);

export default router;

