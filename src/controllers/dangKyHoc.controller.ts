import { Request, Response, NextFunction } from 'express';
import {
  createDangKyHoc,
  getDangKyHocs,
  getDangKyHocById,
  updateDangKyHoc,
  updateTrangThaiDangKyHoc,
  deleteDangKyHoc,
  CreateDangKyHocDto,
  UpdateDangKyHocDto,
} from '../services/dangKyHoc.service';

// Tạo đăng ký học
export const createDangKyHocController = async (
  req: Request<unknown, unknown, CreateDangKyHocDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const dangKyHoc = await createDangKyHoc(req.body);
    return res.status(201).json({
      success: true,
      data: dangKyHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách đăng ký học
export const getDangKyHocsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, hocVienId, lopHocId, trangThai } = req.query;

    const pageNumber = page ? Number(page) : undefined;
    const limitNumber = limit ? Number(limit) : undefined;

    const result = await getDangKyHocs({
      page: pageNumber,
      limit: limitNumber,
      hocVienId: hocVienId as string | undefined,
      lopHocId: lopHocId as string | undefined,
      trangThai: trangThai as any,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết 1 đăng ký học
export const getDangKyHocByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const dangKyHoc = await getDangKyHocById(req.params.id);
    if (!dangKyHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký học',
      });
    }

    return res.json({
      success: true,
      data: dangKyHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật đăng ký học
export const updateDangKyHocController = async (
  req: Request<{ id: string }, unknown, UpdateDangKyHocDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const dangKyHoc = await updateDangKyHoc(req.params.id, req.body);
    if (!dangKyHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký học',
      });
    }

    return res.json({
      success: true,
      data: dangKyHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Đổi trạng thái đăng ký học
export const updateTrangThaiDangKyHocController = async (
  req: Request<
    { id: string },
    unknown,
    { trangThai: 'dang_doi' | 'dang_hoc' | 'tam_dung' | 'da_ket_thuc' }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trangThai } = req.body;
    const dangKyHoc = await updateTrangThaiDangKyHoc(req.params.id, trangThai);
    if (!dangKyHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký học',
      });
    }

    return res.json({
      success: true,
      data: dangKyHoc,
    });
  } catch (error) {
    next(error);
  }
};

// "Xóa" đăng ký học: set trạng thái = 'da_ket_thuc'
export const deleteDangKyHocController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const dangKyHoc = await deleteDangKyHoc(req.params.id);
    if (!dangKyHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đăng ký học',
      });
    }

    return res.json({
      success: true,
      message: 'Đã chuyển trạng thái đăng ký học thành đã kết thúc',
      data: dangKyHoc,
    });
  } catch (error) {
    next(error);
  }
};