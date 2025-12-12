import { Router } from 'express';
import {
  getPhongTapController,
  createPhongTapController,
  updatePhongTapController,
  getPhongTapSummaryController,
} from '../controllers/phongTap.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/summary', authMiddleware, getPhongTapSummaryController);

// GET /api/phong-tap         -> lấy thông tin phòng tập hiện tại
router.get('/', authMiddleware, getPhongTapController);

// POST /api/phong-tap        -> tạo phòng tập (chỉ được tạo 1 lần)
router.post('/', authMiddleware, createPhongTapController);

// PUT /api/phong-tap         -> cập nhật phòng tập hiện tại
router.put('/', authMiddleware, updatePhongTapController);

export default router;