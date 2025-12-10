import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route này yêu cầu JWT
router.get('/me', authMiddleware, getMe);

export default router;
