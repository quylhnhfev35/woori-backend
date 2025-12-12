import { Schema, model, Document, Types } from 'mongoose';

export interface ILichHocItem {
  thuTrongTuan: number; // 1: Thứ 2, 2: Thứ 3,... 7: Chủ nhật
  gioBatDau: string; // "18:00"
  gioKetThuc: string; // "19:30"
}

export interface ILopHoc extends Document {
  tenLop: string;
  capDo: 'thieu_nhi' | 'can_ban' | 'trung_cap' | 'nang_cao';
  moTa?: string;

  phongTap?: Types.ObjectId;

  giangVienChinh?: Types.ObjectId;       // ref NguoiDung
  giangVienPhu?: Types.ObjectId[];       // ref NguoiDung[]

  soLuongToiDa?: number;
  soLuongHocVienHienTai: number;
  lichHoc: ILichHocItem[];
  hocPhiMotThang: number;
  dangMo: boolean;
  trangThai: 'chua_bat_dau' | 'dang_dien_ra' | 'da_hoan_thanh' | 'da_huy';

  thoiGianKhaiGiang: Date;
  thoiGianKetThuc?: Date;
}

const LichHocItemSchema = new Schema<ILichHocItem>(
  {
    thuTrongTuan: { type: Number, required: true, min: 1, max: 7 },
    gioBatDau: { type: String, required: true },
    gioKetThuc: { type: String, required: true },
  },
  { _id: false }
);

const LopHocSchema = new Schema<ILopHoc>(
  {
    tenLop: { type: String, required: true, trim: true },
    capDo: {
      type: String,
      enum: ['thieu_nhi', 'can_ban', 'trung_cap', 'nang_cao'],
      required: true,
    },
    moTa: { type: String },
    phongTap: { type: Schema.Types.ObjectId, ref: 'PhongTap' },

    giangVienChinh: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    giangVienPhu: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    soLuongToiDa: { type: Number },
    lichHoc: { type: [LichHocItemSchema], default: [] },
    hocPhiMotThang: { type: Number, required: true },
    dangMo: { type: Boolean, default: true },
    trangThai: {
      type: String,
      enum: ['chua_bat_dau', 'dang_dien_ra', 'da_hoan_thanh', 'da_huy'],
      default: 'chua_bat_dau',
      required: true,
    },
    
    thoiGianKhaiGiang: {
      type: Date,
      required: true,
    },
    thoiGianKetThuc: {
      type: Date,
    },
    soLuongHocVienHienTai: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

LopHocSchema.index({ giangVienChinh: 1, dangMo: 1 });

export const LopHoc = model<ILopHoc>('LopHoc', LopHocSchema);