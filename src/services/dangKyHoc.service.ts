import { DangKyHoc, IDangKyHoc } from '../models/DangKyHoc';
import { LopHoc } from '../models/LopHoc';

export type TrangThaiDangKyHoc =
  | 'dang_doi'
  | 'dang_hoc'
  | 'tam_dung'
  | 'da_ket_thuc';

export interface CreateDangKyHocDto {
  hocVien: string; // HocVien _id
  lopHoc: string;  // LopHoc _id
  ngayBatDau: Date;
  ngayKetThucDuKien?: Date;
  hocPhiMotThangTaiThoiDiemDangKy?: number; // nếu không truyền, sẽ lấy từ LopHoc
  soThangDaDong?: number;
  trangThai?: TrangThaiDangKyHoc;
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

// --------- Helper: trạng thái nào được tính vào sĩ số lớp ---------
const isCountingStatus = (status: TrangThaiDangKyHoc): boolean => {
  // Nghiệp vụ: các trạng thái đang còn hiệu lực
  return status === 'dang_doi' || status === 'dang_hoc' || status === 'tam_dung';
};

// Helper: cập nhật số lượng học viên hiện tại của lớp khi trạng thái đăng ký thay đổi
const handleChangeTrangThaiSoLuongHocVien = async (params: {
  lopHocId: string;
  oldTrangThai: TrangThaiDangKyHoc;
  newTrangThai: TrangThaiDangKyHoc;
}) => {
  const { lopHocId, oldTrangThai, newTrangThai } = params;

  const wasCounting = isCountingStatus(oldTrangThai);
  const isCounting = isCountingStatus(newTrangThai);

  let delta = 0;

  if (!wasCounting && isCounting) {
    // Ví dụ: da_ket_thuc -> dang_doi
    delta = 1;
  } else if (wasCounting && !isCounting) {
    // Ví dụ: dang_hoc -> da_ket_thuc
    delta = -1;
  }

  if (delta !== 0) {
    await LopHoc.findByIdAndUpdate(
      lopHocId,
      {
        $inc: { soLuongHocVienHienTai: delta },
      },
      { new: true }
    );
  }
};

// --------- Tạo đăng ký học mới ---------
export const createDangKyHoc = async (
  payload: CreateDangKyHocDto
): Promise<IDangKyHoc> => {
  // Luôn load LopHoc để:
  // - kiểm tra trạng thái lớp có được phép đăng ký không
  // - lấy học phí nếu không truyền vào
  const lopHoc = await LopHoc.findById(payload.lopHoc);

  if (!lopHoc) {
    throw new Error('Lớp học không tồn tại');
  }

  // Không cho đăng ký vào lớp đã hoàn thành hoặc đã hủy
  if (lopHoc.trangThai === 'da_hoan_thanh' || lopHoc.trangThai === 'da_huy') {
    throw new Error('Lớp học đã kết thúc hoặc đã hủy, không thể đăng ký mới');
  }

  // Nếu lớp không mở tuyển sinh thì không cho đăng ký
  if (lopHoc.dangMo === false) {
    throw new Error('Lớp học hiện đang không mở đăng ký');
  }

  // Kiểm tra số lượng tối đa (nếu có cấu hình)
  if (
    typeof lopHoc.soLuongToiDa === 'number' &&
    lopHoc.soLuongHocVienHienTai >= lopHoc.soLuongToiDa
  ) {
    throw new Error('Lớp học đã đủ số lượng học viên');
  }

  // Nếu không truyền học phí, tự lấy từ LopHoc
  const hocPhi =
    payload.hocPhiMotThangTaiThoiDiemDangKy ?? lopHoc.hocPhiMotThang;

  // Xác định trạng thái đăng ký ban đầu theo nghiệp vụ:
  let trangThai: TrangThaiDangKyHoc;

  if (lopHoc.trangThai === 'chua_bat_dau') {
    // ⭐ Lớp chưa bắt đầu ⇒ luôn là "dang_doi", không cho "dang_hoc"
    trangThai = 'dang_doi';
  } else {
    // Lớp đã/đang diễn ra: cho phép FE gửi trạng thái, default = 'dang_doi'
    trangThai = payload.trangThai || 'dang_doi';
  }

  const dangKyHoc = await DangKyHoc.create({
    ...payload,
    hocPhiMotThangTaiThoiDiemDangKy: hocPhi,
    trangThai,
  });

  // Nếu đăng ký này ở trạng thái "được tính vào sĩ số" ⇒ +1
  if (isCountingStatus(trangThai)) {
    await LopHoc.findByIdAndUpdate(lopHoc._id, {
      $inc: { soLuongHocVienHienTai: 1 },
    });
  }

  return dangKyHoc;
};

// --------- Lấy danh sách đăng ký học ---------
export const getDangKyHocs = async (params: {
  page?: number;
  limit?: number;
  hocVienId?: string;
  lopHocId?: string;
  trangThai?: TrangThaiDangKyHoc;
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
      .populate('hocVien', 'hoTen soLienHe capDaiHienTai')
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

// --------- Lấy chi tiết 1 đăng ký học ---------
export const getDangKyHocById = async (
  id: string
): Promise<IDangKyHoc | null> => {
  const dangKyHoc = await DangKyHoc.findById(id)
    .populate('hocVien', 'hoTen soLienHe capDaiHienTai')
    .populate('lopHoc', 'tenLop capDo hocPhiMotThang');
  return dangKyHoc;
};

// --------- Cập nhật đăng ký học (có thể đổi cả trạng thái) ---------
export const updateDangKyHoc = async (
  id: string,
  payload: UpdateDangKyHocDto
): Promise<IDangKyHoc | null> => {
  // Lấy bản ghi cũ để so sánh trạng thái & lấy LopHoc
  const oldDangKyHoc = await DangKyHoc.findById(id);
  if (!oldDangKyHoc) {
    return null;
  }

  // Nếu FE muốn đổi trạng thái thì phải check nghiệp vụ theo trạng thái lớp
  if (payload.trangThai) {
    const lopHoc = await LopHoc.findById(oldDangKyHoc.lopHoc);

    if (!lopHoc) {
      throw new Error('Lớp học không tồn tại');
    }

    if (lopHoc.trangThai === 'chua_bat_dau' && payload.trangThai !== 'dang_doi') {
      throw new Error(
        'Lớp chưa bắt đầu, trạng thái đăng ký chỉ có thể là "dang_doi"'
      );
    }
  }

  const dangKyHoc = await DangKyHoc.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!dangKyHoc) {
    return null;
  }

  // Nếu có đổi trạng thái → cập nhật số lượng học viên lớp
  if (payload.trangThai && payload.trangThai !== oldDangKyHoc.trangThai) {
    await handleChangeTrangThaiSoLuongHocVien({
      lopHocId: String(oldDangKyHoc.lopHoc),
      oldTrangThai: oldDangKyHoc.trangThai as TrangThaiDangKyHoc,
      newTrangThai: payload.trangThai,
    });
  }

  return dangKyHoc;
};

// --------- Đổi trạng thái đăng ký học (shortcut) ---------
export const updateTrangThaiDangKyHoc = async (
  id: string,
  trangThai: TrangThaiDangKyHoc
): Promise<IDangKyHoc | null> => {
  const oldDangKyHoc = await DangKyHoc.findById(id);
  if (!oldDangKyHoc) {
    return null;
  }

  const lopHoc = await LopHoc.findById(oldDangKyHoc.lopHoc);
  if (!lopHoc) {
    throw new Error('Lớp học không tồn tại');
  }

  if (lopHoc.trangThai === 'chua_bat_dau' && trangThai !== 'dang_doi') {
    throw new Error(
      'Lớp chưa bắt đầu, trạng thái đăng ký chỉ có thể là "dang_doi"'
    );
  }

  const dangKyHoc = await DangKyHoc.findByIdAndUpdate(
    id,
    { trangThai },
    { new: true, runValidators: true }
  );

  if (!dangKyHoc) {
    return null;
  }

  await handleChangeTrangThaiSoLuongHocVien({
    lopHocId: String(oldDangKyHoc.lopHoc),
    oldTrangThai: oldDangKyHoc.trangThai as TrangThaiDangKyHoc,
    newTrangThai: trangThai,
  });

  return dangKyHoc;
};

// --------- "Xóa" đăng ký học: set trạng thái = 'da_ket_thuc' ---------
export const deleteDangKyHoc = async (
  id: string
): Promise<IDangKyHoc | null> => {
  // Tái sử dụng logic bên updateTrangThaiDangKyHoc cho đồng bộ (tự -1 sĩ số nếu cần)
  const dangKyHoc = await updateTrangThaiDangKyHoc(id, 'da_ket_thuc');
  return dangKyHoc;
};