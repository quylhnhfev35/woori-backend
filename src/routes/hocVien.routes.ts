import { Router } from 'express';
import {
  createHocVienController,
  getHocViensController,
  getHocVienByIdController,
  updateHocVienController,
  deleteHocVienController,
} from '../controllers/hocVien.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/hoc-vien
router.post('/', authMiddleware, createHocVienController);

// GET /api/hoc-vien
router.get('/', authMiddleware, getHocViensController);

// GET /api/hoc-vien/:id
router.get('/:id', authMiddleware, getHocVienByIdController);

// PUT /api/hoc-vien/:id
router.put('/:id', authMiddleware, updateHocVienController);

// DELETE /api/hoc-vien/:id
router.delete('/:id', authMiddleware, deleteHocVienController);

export default router;