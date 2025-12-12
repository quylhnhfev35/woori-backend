import { BuoiTap } from "../models/BuoiTap";
import { DangKyHoc } from "../models/DangKyHoc";
import { LopHoc } from "../models/LopHoc";
import { IPhongTap, PhongTap } from "../models/PhongTap";

// DTO cho create / update
export interface CreatePhongTapDto {
  tenPhong: string;
  diaChi?: string;
  sucChuaToiDa?: number;
  moTa?: string;
  dangHoatDong?: boolean;
  ghiChu?: string;
}

export interface UpdatePhongTapDto extends Partial<CreatePhongTapDto> {}

export interface PhongTapSummary {
  soLopDangDienRa: number;
  tongHocVienDangHoc: number;
  tongBuoiTapHomNay: number;
}

// Lấy tổng quan phòng tập: số lớp, số HV, số buổi tập hôm nay
export const getPhongTapSummary = async (): Promise<PhongTapSummary> => {
  const now = new Date();

  // Tính mốc đầu ngày & cuối ngày hôm nay
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [soLopDangDienRa, tongHocVienDangHoc, tongBuoiTapHomNay] =
    await Promise.all([
      // Số lớp đang diễn ra
      LopHoc.countDocuments({ trangThai: 'dang_dien_ra' }),

      // Tổng học viên đang học
      DangKyHoc.countDocuments({ trangThai: 'dang_hoc' }),

      // Tổng buổi tập hôm nay
      BuoiTap.countDocuments({
        ngay: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        trangThai: { $ne: 'huy' },
      }),
    ]);

  return {
    soLopDangDienRa,
    tongHocVienDangHoc,
    tongBuoiTapHomNay,
  };
};

// Lấy phòng tập hiện tại (vì hiện giờ chỉ có 1)
export const getPhongTap = async (): Promise<IPhongTap | null> => {
  // Lấy phòng tập đầu tiên được tạo
  const phongTap = await PhongTap.findOne().sort({ createdAt: 1 });
  return phongTap;
};

// Tạo mới phòng tập
export const createPhongTap = async (
  payload: CreatePhongTapDto
): Promise<IPhongTap> => {
  const phongTap = await PhongTap.create(payload);
  return phongTap;
};

// (Optional) Update phòng tập hiện tại – để sau dùng nếu cần
export const updatePhongTap = async (
  id: string,
  payload: UpdatePhongTapDto
): Promise<IPhongTap | null> => {
  const phongTap = await PhongTap.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return phongTap;
};