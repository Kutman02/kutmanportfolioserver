import express from 'express';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes
router.post('/', authenticateToken, createSkill);
router.put('/:id', authenticateToken, updateSkill);
router.delete('/:id', authenticateToken, deleteSkill);

export default router;

