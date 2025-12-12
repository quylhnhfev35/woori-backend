import { Router } from 'express';
import authRoutes from './auth.routes';
import hocVienRoutes from './hocVien.routes';
import phongTapRoutes from './phongTap.routes';
import dangKyHocRoutes from './dangKyHoc.routes';
import lopHocRoutes from './lopHoc.routes'
import buoiTapRoutes from './buoiTap.routes'

const router = Router();

// Mount route auth
router.use('/auth', authRoutes);
router.use('/hoc-vien', hocVienRoutes);
router.use('/phong-tap', phongTapRoutes);
router.use('/dang-ky-hoc', dangKyHocRoutes);
router.use('/lop-hoc', lopHocRoutes);
router.use('/buoi-tap', buoiTapRoutes)

// Test health
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy 🚀' });
});

export default router;