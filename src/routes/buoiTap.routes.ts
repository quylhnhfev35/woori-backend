import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware';
import { createBuoiTapController, deleteBuoiTapController, getBuoiTapByIdController, getBuoiTapsController, updateBuoiTapController } from '../controllers/buoiTap.controller';

const router = Router();

// POST /api/buoi-tap
// Tạo buổi tập thủ công (buổi bù, thi, extra, ...)
router.post('/', authMiddleware, createBuoiTapController);

// GET /api/buoi-tap
router.get('/', authMiddleware, getBuoiTapsController);

// GET /api/buoi-tap/:id
router.get('/:id', authMiddleware, getBuoiTapByIdController);

// PUT /api/buoi-tap/:id
// Cập nhật buổi tập (giờ, giảng viên, trạng thái, ghi chú...)
router.put('/:id', authMiddleware, updateBuoiTapController);

// DELETE /api/buoi-tap/:id
// "Xóa" buổi tập: thực tế set trangThai = 'huy'
router.delete('/:id', authMiddleware, deleteBuoiTapController);

export default router;