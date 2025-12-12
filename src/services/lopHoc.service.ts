import { LopHoc, ILopHoc } from '../models/LopHoc';
import { generateBuoiTapForLopHoc } from './buoiTap.service';
import { Types } from 'mongoose';

// DTO cho lịch học
export interface LichHocItemDto {
  thuTrongTuan: number; // 1-7
  gioBatDau: string;    // "18:00"
  gioKetThuc: string;   // "19:30"
}

// DTO tạo lớp học
export interface CreateLopHocDto {
  tenLop: string;
  capDo: 'thieu_nhi' | 'can_ban' | 'trung_cap' | 'nang_cao';
  moTa?: string;
  phongTap?: string;

  giangVienChinh?: string;
  giangVienPhu?: string[];

  soLuongToiDa?: number;
  hocPhiMotThang: number;
  dangMo?: boolean;

  thoiGianKhaiGiang: Date;
  thoiGianKetThuc?: Date;
  lichHoc: LichHocItemDto[];

  autoGenerateBuoiTap?: boolean;
}

// DTO update lớp học
export interface UpdateLopHocDto extends Partial<CreateLopHocDto> {}

// Kết quả list lớp học có phân trang
export interface LopHocListResult {
  data: ILopHoc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Service tạo lớp học
export const createLopHoc = async (
  payload: CreateLopHocDto
): Promise<ILopHoc> => {
  const { autoGenerateBuoiTap, ...rest } = payload;

  const docToCreate = {
    ...rest,
    phongTap: rest.phongTap ? new Types.ObjectId(rest.phongTap) : undefined,
    giangVienChinh: rest.giangVienChinh
      ? new Types.ObjectId(rest.giangVienChinh)
      : undefined,
    giangVienPhu: rest.giangVienPhu
      ? rest.giangVienPhu.map((id) => new Types.ObjectId(id))
      : undefined,
  };

  const lopHoc = await LopHoc.create(docToCreate);

  // Nếu FE gửi autoGenerateBuoiTap = true => sinh buổi tập luôn
  if (autoGenerateBuoiTap) {
    await generateBuoiTapForLopHoc(lopHoc._id.toString());
  }

  return lopHoc;
};

// Service lấy danh sách lớp học (filter + search + phân trang)
export const getLopHocs = async (params: {
  page?: number;
  limit?: number;
  keyword?: string;
  capDo?: 'thieu_nhi' | 'can_ban' | 'trung_cap' | 'nang_cao';
  dangMo?: boolean;
  giangVienChinh?: string;
}): Promise<LopHocListResult> => {
  const {
    page = 1,
    limit = 10,
    keyword,
    capDo,
    dangMo,
    giangVienChinh,
  } = params;

  const query: Record<string, any> = {};

  if (capDo) {
    query.capDo = capDo;
  }

  if (typeof dangMo === 'boolean') {
    query.dangMo = dangMo;
  }

  if (giangVienChinh) {
    query.giangVienChinh = giangVienChinh;
  }

  if (keyword) {
    query.$or = [
      { tenLop: { $regex: keyword, $options: 'i' } },
      { moTa: { $regex: keyword, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    LopHoc.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LopHoc.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

// Service lấy chi tiết 1 lớp học
export const getLopHocById = async (id: string): Promise<ILopHoc | null> => {
  const lopHoc = await LopHoc.findById(id);
  return lopHoc;
};

// Service update lớp học
export const updateLopHoc = async (
  id: string,
  payload: UpdateLopHocDto
): Promise<ILopHoc | null> => {
  const updateDoc: any = { ...payload };

  if (payload.phongTap) {
    updateDoc.phongTap = new Types.ObjectId(payload.phongTap);
  }

  if (payload.giangVienChinh) {
    updateDoc.giangVienChinh = new Types.ObjectId(payload.giangVienChinh);
  }

  if (payload.giangVienPhu) {
    updateDoc.giangVienPhu = payload.giangVienPhu?.map(
      (gvId) => new Types.ObjectId(gvId)
    );
  }

  const lopHoc = await LopHoc.findByIdAndUpdate(id, updateDoc, {
    new: true,
    runValidators: true,
  });

  return lopHoc;
};

// Đóng / mở lớp
export const toggleTrangThaiLopHoc = async (
  id: string,
  dangMo: boolean
): Promise<ILopHoc | null> => {
  const lopHoc = await LopHoc.findByIdAndUpdate(
    id,
    { dangMo },
    { new: true, runValidators: true }
  );
  return lopHoc;
};

// Xóa hẳn lớp học
export const deleteLopHoc = async (id: string): Promise<ILopHoc | null> => {
  const lopHoc = await LopHoc.findByIdAndDelete(id);
  return lopHoc;
};

export const generateBuoiTapForLopHocService = async (
  lopHocId: string
): Promise<{ createdCount: number }> => {
  const createdCount = await generateBuoiTapForLopHoc(lopHocId, {
    clearExisting: true,
  });
  return { createdCount };
};