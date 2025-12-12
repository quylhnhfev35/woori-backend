import { Request, Response, NextFunction } from 'express';
import {
  createPhongTap,
  getPhongTap,
  updatePhongTap,
  CreatePhongTapDto,
  UpdatePhongTapDto,
  getPhongTapSummary,
} from '../services/phongTap.service';

// GET /api/phong-tap/summary
export const getPhongTapSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await getPhongTapSummary();

    return res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/phong-tap - lấy thông tin phòng tập hiện tại
export const getPhongTapController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const phongTap = await getPhongTap();

    if (!phongTap) {
      return res.status(404).json({
        success: false,
        message: 'Chưa cấu hình phòng tập nào',
      });
    }

    return res.json({
      success: true,
      data: phongTap,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/phong-tap - tạo mới phòng tập (chỉ cho phép tạo nếu chưa có)
export const createPhongTapController = async (
  req: Request<unknown, unknown, CreatePhongTapDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check xem đã có phòng tập nào chưa
    const existing = await getPhongTap();
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          'Phòng tập đã được cấu hình. Hiện tại hệ thống chỉ hỗ trợ 1 phòng tập.',
      });
    }

    const phongTap = await createPhongTap(req.body);

    return res.status(201).json({
      success: true,
      data: phongTap,
    });
  } catch (error) {
    next(error);
  }
};

// (Optional) PUT /api/phong-tap - cập nhật phòng tập hiện tại
export const updatePhongTapController = async (
  req: Request<unknown, unknown, UpdatePhongTapDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const phongTapHienTai = await getPhongTap();

    if (!phongTapHienTai) {
      return res.status(404).json({
        success: false,
        message: 'Chưa có phòng tập để cập nhật',
      });
    }

    const phongTap = await updatePhongTap(phongTapHienTai._id.toString(), req.body);

    return res.json({
      success: true,
      data: phongTap,
    });
  } catch (error) {
    next(error);
  }
};