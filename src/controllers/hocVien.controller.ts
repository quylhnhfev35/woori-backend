import { Request, Response, NextFunction } from 'express';
import {
  createHocVien,
  getHocViens,
  getHocVienById,
  updateHocVien,
  deleteHocVien,
  CreateHocVienDto,
  UpdateHocVienDto,
} from '../services/hocVien.service';

// Tạo mới học viên
export const createHocVienController = async (
  req: Request<unknown, unknown, CreateHocVienDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hocVien = await createHocVien(req.body);
    return res.status(201).json({
      success: true,
      data: hocVien,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách học viên
export const getHocViensController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page,
      limit,
      keyword,
      trangThai,
      capDaiHienTai,
    } = req.query;

    const pageNumber = page ? Number(page) : undefined;
    const limitNumber = limit ? Number(limit) : undefined;

    const result = await getHocViens({
      page: pageNumber,
      limit: limitNumber,
      keyword: keyword as string | undefined,
      trangThai: trangThai as any,
      capDaiHienTai: capDaiHienTai as string | undefined,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết 1 học viên
export const getHocVienByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hocVien = await getHocVienById(req.params.id);
    if (!hocVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }

    return res.json({
      success: true,
      data: hocVien,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật học viên
export const updateHocVienController = async (
  req: Request<{ id: string }, unknown, UpdateHocVienDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hocVien = await updateHocVien(req.params.id, req.body);
    if (!hocVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }

    return res.json({
      success: true,
      data: hocVien,
    });
  } catch (error) {
    next(error);
  }
};

// "Xóa" học viên (set trạng thái nghỉ hẳn)
export const deleteHocVienController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hocVien = await deleteHocVien(req.params.id);
    if (!hocVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }

    return res.json({
      success: true,
      message: 'Đã cập nhật trạng thái học viên thành nghỉ hẳn',
      data: hocVien,
    });
  } catch (error) {
    next(error);
  }
};