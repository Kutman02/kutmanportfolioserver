import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

export default router;

