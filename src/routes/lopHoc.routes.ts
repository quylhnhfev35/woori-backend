import { Router } from 'express';
import {
  createLopHocController,
  getLopHocsController,
  getLopHocByIdController,
  updateLopHocController,
  toggleTrangThaiLopHocController,
  deleteLopHocController,
} from '../controllers/lopHoc.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/lop-hoc
router.post('/', authMiddleware, createLopHocController);

// GET /api/lop-hoc
router.get('/', authMiddleware, getLopHocsController);

// GET /api/lop-hoc/:id
router.get('/:id', authMiddleware, getLopHocByIdController);

// PUT /api/lop-hoc/:id
router.put('/:id', authMiddleware, updateLopHocController);

// PATCH /api/lop-hoc/:id/trang-thai
router.patch('/:id/trang-thai', authMiddleware, toggleTrangThaiLopHocController);

// DELETE /api/lop-hoc/:id
router.delete('/:id', authMiddleware, deleteLopHocController);

export default router;