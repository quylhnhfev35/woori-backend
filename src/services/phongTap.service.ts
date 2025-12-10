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