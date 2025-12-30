import express from 'express';
import {
  getResume,
  updateResume
} from '../controllers/resumeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getResume);

// Protected route
router.put('/', authenticateToken, updateResume);

export default router;

