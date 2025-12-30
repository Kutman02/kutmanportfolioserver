import express from 'express';
import { uploadDocument } from '../middleware/uploadDocument.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

// Загрузка документов (резюме) - требует авторизации
router.post('/', authenticateToken, uploadDocument.single('file'), uploadFile);

export default router;

