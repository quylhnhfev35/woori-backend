import { HocVien, IHocVien } from '../models/HocVien';

// DTO cho create / update
export interface CreateHocVienDto {
  hoTen: string;
  ngaySinh?: Date;
  gioiTinh?: 'nam' | 'nu' | 'khac';
  soLienHe?: string;
  diaChi?: string;
  capDaiHienTai?: string;
  ngayThamGia?: Date;
  trangThai?: 'dang_doi' | 'dang_hoc' | 'tam_nghi' | 'nghi_han';
  nguoiGiamHo?: string;
  soDienThoaiNguoiGiamHo?: string;
  ghiChu?: string;
}

export interface UpdateHocVienDto extends Partial<CreateHocVienDto> {}

// Kiểu trả về cho list có phân trang
export interface HocVienListResult {
  data: IHocVien[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Service tạo học viên mới
export const createHocVien = async (
  payload: CreateHocVienDto
): Promise<IHocVien> => {
  const hocVien = await HocVien.create(payload);
  return hocVien;
};

// Service lấy danh sách học viên (có filter + search + phân trang)
export const getHocViens = async (params: {
  page?: number;
  limit?: number;
  keyword?: string;
  trangThai?: 'dang_hoc' | 'tam_nghi' | 'nghi_han';
  capDaiHienTai?: string;
}): Promise<HocVienListResult> => {
  const {
    page = 1,
    limit = 10,
    keyword,
    trangThai,
    capDaiHienTai,
  } = params;

  const query: Record<string, any> = {};

  // Tìm theo trạng thái
  if (trangThai) {
    query.trangThai = trangThai;
  }

  // Tìm theo cấp đai
  if (capDaiHienTai) {
    query.capDaiHienTai = capDaiHienTai;
  }

  // Tìm theo tên (dùng text index hoTen) hoặc số điện thoại
  if (keyword) {
    query.$or = [
      { $text: { $search: keyword } },
      { soLienHe: { $regex: keyword, $options: 'i' } },
      { soDienThoaiNguoiGiamHo: { $regex: keyword, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    HocVien.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    HocVien.countDocuments(query),
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

// Service lấy chi tiết 1 học viên
export const getHocVienById = async (id: string): Promise<IHocVien | null> => {
  const hocVien = await HocVien.findById(id);
  return hocVien;
};

// Service update 1 học viên
export const updateHocVien = async (
  id: string,
  payload: UpdateHocVienDto
): Promise<IHocVien | null> => {
  const hocVien = await HocVien.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return hocVien;
};

// Service "xóa" học viên
// Ở đây mình chỉ set trạng thái = 'nghi_han' để tránh mất dữ liệu
export const deleteHocVien = async (id: string): Promise<IHocVien | null> => {
  const hocVien = await HocVien.findByIdAndUpdate(
    id,
    { trangThai: 'nghi_han' },
    { new: true }
  );
  return hocVien;
};