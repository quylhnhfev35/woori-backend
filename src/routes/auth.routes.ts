import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

export default router;
