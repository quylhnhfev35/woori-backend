import { DangKyHoc, IDangKyHoc } from '../models/DangKyHoc';
import { LopHoc } from '../models/LopHoc';

export interface CreateDangKyHocDto {
  hocVien: string; // HocVien _id
  lopHoc: string;  // LopHoc _id
  ngayBatDau: Date;
  ngayKetThucDuKien?: Date;
  hocPhiMotThangTaiThoiDiemDangKy?: number; // nếu không truyền, sẽ lấy từ LopHoc
  soThangDaDong?: number;
  trangThai?: 'dang_doi' | 'dang_hoc' | 'tam_dung' | 'da_ket_thuc';
  ghiChu?: string;
}

export interface UpdateDangKyHocDto extends Partial<CreateDangKyHocDto> {}

export interface DangKyHocListResult {
  data: IDangKyHoc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tạo đăng ký học mới
export const createDangKyHoc = async (
  payload: CreateDangKyHocDto
): Promise<IDangKyHoc> => {
  let hocPhi = payload.hocPhiMotThangTaiThoiDiemDangKy;

  // Nếu không truyền học phí, tự lấy từ LopHoc
  if (!hocPhi) {
    const lopHoc = await LopHoc.findById(payload.lopHoc);
    if (!lopHoc) {
      throw new Error('Lớp học không tồn tại');
    }
    hocPhi = lopHoc.hocPhiMotThang;
  }

  const dangKyHoc = await DangKyHoc.create({
    ...payload,
    hocPhiMotThangTaiThoiDiemDangKy: hocPhi,
  });

  return dangKyHoc;
};

// Lấy danh sách đăng ký học
export const getDangKyHocs = async (params: {
  page?: number;
  limit?: number;
  hocVienId?: string;
  lopHocId?: string;
  trangThai?: 'dang_doi' | 'dang_hoc' | 'tam_dung' | 'da_ket_thuc';
}): Promise<DangKyHocListResult> => {
  const {
    page = 1,
    limit = 10,
    hocVienId,
    lopHocId,
    trangThai,
  } = params;

  const query: Record<string, any> = {};

  if (hocVienId) {
    query.hocVien = hocVienId;
  }

  if (lopHocId) {
    query.lopHoc = lopHocId;
  }

  if (trangThai) {
    query.trangThai = trangThai;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    DangKyHoc.find(query)
      .populate('hocVien', 'hoTen soLienHe capDaiHienTai') // chọn field nhẹ
      .populate('lopHoc', 'tenLop capDo hocPhiMotThang')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    DangKyHoc.countDocuments(query),
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

// Lấy chi tiết 1 đăng ký học
export const getDangKyHocById = async (
  id: string
): Promise<IDangKyHoc | null> => {
  const dangKyHoc = await DangKyHoc.findById(id)
    .populate('hocVien', 'hoTen soLienHe capDaiHienTai')
    .populate('lopHoc', 'tenLop capDo hocPhiMotThang');
  return dangKyHoc;
};

// Cập nhật đăng ký học
export const updateDangKyHoc = async (
  id: string,
  payload: UpdateDangKyHocDto
): Promise<IDangKyHoc | null> => {
  const dangKyHoc = await DangKyHoc.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return dangKyHoc;
};

// Đổi trạng thái đăng ký học
export const updateTrangThaiDangKyHoc = async (
  id: string,
  trangThai: 'dang_doi' | 'dang_hoc' | 'tam_dung' | 'da_ket_thuc'
): Promise<IDangKyHoc | null> => {
  const dangKyHoc = await DangKyHoc.findByIdAndUpdate(
    id,
    { trangThai },
    { new: true, runValidators: true }
  );
  return dangKyHoc;
};

// "Xóa" đăng ký học: set trạng thái = 'da_ket_thuc'
export const deleteDangKyHoc = async (
  id: string
): Promise<IDangKyHoc | null> => {
  const dangKyHoc = await DangKyHoc.findByIdAndUpdate(
    id,
    { trangThai: 'da_ket_thuc' },
    { new: true, runValidators: true }
  );
  return dangKyHoc;
};