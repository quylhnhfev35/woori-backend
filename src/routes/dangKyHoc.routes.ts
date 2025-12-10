import { Router } from 'express';
import {
  createDangKyHocController,
  getDangKyHocsController,
  getDangKyHocByIdController,
  updateDangKyHocController,
  updateTrangThaiDangKyHocController,
  deleteDangKyHocController,
} from '../controllers/dangKyHoc.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/dang-ky-hoc
router.post('/', authMiddleware, createDangKyHocController);

// GET /api/dang-ky-hoc
router.get('/', authMiddleware, getDangKyHocsController);

// GET /api/dang-ky-hoc/:id
router.get('/:id', authMiddleware, getDangKyHocByIdController);

// PUT /api/dang-ky-hoc/:id
router.put('/:id', authMiddleware, updateDangKyHocController);

// PATCH /api/dang-ky-hoc/:id/trang-thai
router.patch(
  '/:id/trang-thai',
  authMiddleware,
  updateTrangThaiDangKyHocController
);

// DELETE /api/dang-ky-hoc/:id
router.delete('/:id', authMiddleware, deleteDangKyHocController);

export default router;