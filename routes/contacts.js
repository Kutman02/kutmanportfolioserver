import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getContacts);
router.get('/:id', getContact);

// Protected routes
router.post('/', authenticateToken, createContact);
router.put('/:id', authenticateToken, updateContact);
router.delete('/:id', authenticateToken, deleteContact);

export default router;

