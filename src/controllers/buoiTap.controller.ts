import { Request, Response, NextFunction } from 'express';
import * as buoiTapService from '../services/buoiTap.service';

export const createBuoiTapController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const buoiTap = await buoiTapService.createBuoiTap(req.body);
    res.status(201).json({ success: true, data: buoiTap });
  } catch (error) {
    next(error);
  }
};

export const getBuoiTapsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await buoiTapService.getBuoiTaps({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      lopHocId: req.query.lopHocId as string | undefined,
      giangVienId: req.query.giangVienId as string | undefined,
      fromDate: req.query.fromDate
        ? new Date(String(req.query.fromDate))
        : undefined,
      toDate: req.query.toDate ? new Date(String(req.query.toDate)) : undefined,
      trangThai: req.query.trangThai as any,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getBuoiTapByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const buoiTap = await buoiTapService.getBuoiTapById(req.params.id as string);
    res.json({ success: true, data: buoiTap });
  } catch (error) {
    next(error);
  }
};

export const updateBuoiTapController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const buoiTap = await buoiTapService.updateBuoiTap(
      req.params.id as string,
      req.body
    );
    res.json({ success: true, data: buoiTap });
  } catch (error) {
    next(error);
  }
};

export const deleteBuoiTapController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const buoiTap = await buoiTapService.deleteBuoiTap(req.params.id as string);
    res.json({ success: true, data: buoiTap });
  } catch (error) {
    next(error);
  }
};