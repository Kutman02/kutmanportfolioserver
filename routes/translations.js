import express from 'express';
import {
  getTranslations,
  getTranslation,
  createOrUpdateTranslation,
  importFromFile,
  deleteTranslation
} from '../controllers/translationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTranslations);
router.get('/:language', getTranslation);

// Protected routes
router.post('/', authenticateToken, createOrUpdateTranslation);
router.post('/import', authenticateToken, importFromFile);
router.put('/:language', authenticateToken, createOrUpdateTranslation);
router.delete('/:language', authenticateToken, deleteTranslation);

export default router;

