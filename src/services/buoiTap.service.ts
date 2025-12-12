import { BuoiTap, IBuoiTap } from '../models/BuoiTap';
import { ILichHocItem, LopHoc } from '../models/LopHoc';
import { Types } from 'mongoose';

// DTO tạo buổi tập thủ công
export interface CreateBuoiTapDto {
  lopHoc: string; // LopHoc _id
  ngay: Date;
  gioBatDau?: string;
  gioKetThuc?: string;
  giangVienPhuTrach?: string;
  trangThai?: 'du_kien' | 'da_dien_ra' | 'huy';
  ghiChu?: string;
}

export interface UpdateBuoiTapDto extends Partial<CreateBuoiTapDto> {}

export interface BuoiTapItemResponse {
  buoiTap: IBuoiTap;
  tenGiangVienChinh?: string;
}

export interface BuoiTapListResult {
  data: BuoiTapItemResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BuoiTapQueryParams {
  page?: number;
  limit?: number;
  lopHocId?: string;
  giangVienId?: string;
  fromDate?: Date;
  toDate?: Date;
  trangThai?: 'du_kien' | 'da_dien_ra' | 'huy';
}

export const createBuoiTap = async (
  payload: CreateBuoiTapDto
): Promise<IBuoiTap> => {
  // có thể check LopHoc tồn tại trước cho chắc
  const buoiTap = await BuoiTap.create({
    ...payload,
    lopHoc: new Types.ObjectId(payload.lopHoc),
    giangVienPhuTrach: payload.giangVienPhuTrach
      ? new Types.ObjectId(payload.giangVienPhuTrach)
      : undefined,
  });

  return buoiTap;
};

export const getBuoiTaps = async (
  params: BuoiTapQueryParams
): Promise<BuoiTapListResult> => {
  const {
    page = 1,
    limit = 10,
    lopHocId,
    giangVienId,
    fromDate,
    toDate,
    trangThai,
  } = params;

  const query: Record<string, any> = {};

  if (lopHocId) {
    query.lopHoc = lopHocId;
  }

  if (giangVienId) {
    query.giangVienPhuTrach = giangVienId;
  }

  if (trangThai) {
    query.trangThai = trangThai;
  }

  if (fromDate || toDate) {
    query.ngay = {};
    if (fromDate) query.ngay.$gte = fromDate;
    if (toDate) query.ngay.$lte = toDate;
  }

  const skip = (page - 1) * limit;

  const [rawBuoiTaps, total] = await Promise.all([
    BuoiTap.find(query)
      .populate({
        path: 'lopHoc',
        select:
          'tenLop capDo soLuongHocVienHienTai giangVienChinh',
        populate: {
          path: 'giangVienChinh',
          select: 'hoTen',
        },
      })
      .populate('giangVienPhuTrach', 'hoTen soDienThoai')
      .sort({ ngay: 1, gioBatDau: 1 })
      .skip(skip)
      .limit(limit),
    BuoiTap.countDocuments(query),
  ]);

  // Map sang format trả về
  const data: BuoiTapItemResponse[] = rawBuoiTaps.map((bt) => {
    const lopHoc: any = bt.lopHoc; // đã populate nên dùng any cho gọn
    const giangVienChinh: any = lopHoc?.giangVienChinh;

    return {
      buoiTap: bt,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getBuoiTapById = async (
  id: string
): Promise<IBuoiTap | null> => {
  const buoiTap = await BuoiTap.findById(id)
    .populate('lopHoc', 'tenLop capDo')
    .populate('giangVienPhuTrach', 'hoTen soDienThoai');
  return buoiTap;
};

export const updateBuoiTap = async (
  id: string,
  payload: UpdateBuoiTapDto
): Promise<IBuoiTap | null> => {
  const buoiTap = await BuoiTap.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return buoiTap;
};

// "Xóa" buổi tập: default là set trạng thái = 'huy'
export const deleteBuoiTap = async (
  id: string
): Promise<IBuoiTap | null> => {
  const buoiTap = await BuoiTap.findByIdAndUpdate(
    id,
    { trangThai: 'huy' },
    { new: true, runValidators: true }
  );
  return buoiTap;
};

// ====================== GENERATE BUỔI TẬP TỪ LỚP HỌC ======================

interface GenerateBuoiTapOptions {
  clearExisting?: boolean; // có xóa các buổi "du_kien" trong khoảng thời gian trước khi tạo mới không
}

/**
 * Sinh các BuoiTap cho một LopHoc dựa trên:
 * - thoiGianKhaiGiang
 * - thoiGianKetThuc
 * - lichHoc (thứ trong tuần + giờ)
 */
export const generateBuoiTapForLopHoc = async (
  lopHocId: string,
  options: GenerateBuoiTapOptions = { clearExisting: true }
): Promise<number> => {
  const lopHoc = await LopHoc.findById(lopHocId);

  if (!lopHoc) {
    throw new Error('Lớp học không tồn tại');
  }

  if (!lopHoc.thoiGianKhaiGiang || !lopHoc.thoiGianKetThuc) {
    throw new Error(
      'Lớp học chưa có đầy đủ thông tin thời gian khai giảng / kết thúc'
    );
  }

  if (!lopHoc.lichHoc || lopHoc.lichHoc.length === 0) {
    throw new Error('Lớp học chưa có lịch học trong tuần');
  }

  const start = new Date(lopHoc.thoiGianKhaiGiang);
  const end = new Date(lopHoc.thoiGianKetThuc);

  // Optional: xóa các buổi "dự kiến" hiện tại trong khoảng này để tránh trùng
  if (options.clearExisting) {
    await BuoiTap.deleteMany({
      lopHoc: lopHoc._id,
      trangThai: 'du_kien',
      ngay: { $gte: start, $lte: end },
    });
  }

  const sessionsToCreate: Partial<IBuoiTap>[] = [];

  const current = new Date(start);
  // Đưa giờ phút giây về 00:00 để so sánh ngày cho đơn giản
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const jsDay = current.getDay(); // 0: CN ... 6: Th7
    const thuTrongTuan = jsDay === 0 ? 7 : jsDay; // convert 1..7

    (lopHoc.lichHoc as ILichHocItem[]).forEach((item) => {
      if (item.thuTrongTuan === thuTrongTuan) {
        sessionsToCreate.push({
          lopHoc: lopHoc._id,
          ngay: new Date(current),
          gioBatDau: item.gioBatDau,
          gioKetThuc: item.gioKetThuc,
          giangVienPhuTrach: lopHoc.giangVienChinh,
          trangThai: 'du_kien',
        });
      }
    });

    current.setDate(current.getDate() + 1);
  }

  if (sessionsToCreate.length === 0) {
    return 0;
  }

  await BuoiTap.insertMany(sessionsToCreate);

  return sessionsToCreate.length;
};