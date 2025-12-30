import express from 'express';
import { login, register, initAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
// Initialize admin endpoint (one-time setup)
router.post('/init', initAdmin);
router.get('/init', initAdmin); // Also support GET for easy browser access

export default router;

