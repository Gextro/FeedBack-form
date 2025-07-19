import express from 'express';
import { registerAdmin, authAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', authAdmin);

export default router;
