import express from 'express';
import {
  getProfile,
  updateProfile
} from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getProfile);

// Protected route
router.put('/', authenticateToken, updateProfile);

export default router;

