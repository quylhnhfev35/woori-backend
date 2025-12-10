import { Request, Response, NextFunction } from 'express';
import {
  createLopHoc,
  getLopHocs,
  getLopHocById,
  updateLopHoc,
  toggleTrangThaiLopHoc,
  deleteLopHoc,
  CreateLopHocDto,
  UpdateLopHocDto,
} from '../services/lopHoc.service';

// Tạo mới lớp học
export const createLopHocController = async (
  req: Request<unknown, unknown, CreateLopHocDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lopHoc = await createLopHoc(req.body);
    return res.status(201).json({
      success: true,
      data: lopHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách lớp học
export const getLopHocsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, keyword, capDo, dangMo, giangVienChinh } = req.query;

    const pageNumber = page ? Number(page) : undefined;
    const limitNumber = limit ? Number(limit) : undefined;
    const dangMoBool =
      typeof dangMo === 'string' ? dangMo === 'true' : undefined;

    const result = await getLopHocs({
      page: pageNumber,
      limit: limitNumber,
      keyword: keyword as string | undefined,
      capDo: capDo as any,
      dangMo: dangMoBool,
      giangVienChinh: giangVienChinh as string | undefined,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết 1 lớp học
export const getLopHocByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lopHoc = await getLopHocById(req.params.id);
    if (!lopHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lớp học',
      });
    }

    return res.json({
      success: true,
      data: lopHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật lớp học
export const updateLopHocController = async (
  req: Request<{ id: string }, unknown, UpdateLopHocDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lopHoc = await updateLopHoc(req.params.id, req.body);
    if (!lopHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lớp học',
      });
    }

    return res.json({
      success: true,
      data: lopHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Đóng hoặc mở lớp học
export const toggleTrangThaiLopHocController = async (
  req: Request<{ id: string }, unknown, { dangMo: boolean }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dangMo } = req.body;
    const lopHoc = await toggleTrangThaiLopHoc(req.params.id, dangMo);
    if (!lopHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lớp học',
      });
    }

    return res.json({
      success: true,
      data: lopHoc,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa hẳn lớp học
export const deleteLopHocController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lopHoc = await deleteLopHoc(req.params.id);
    if (!lopHoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lớp học',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa lớp học',
      data: lopHoc,
    });
  } catch (error) {
    next(error);
  }
};