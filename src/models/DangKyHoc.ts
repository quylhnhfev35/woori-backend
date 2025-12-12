import { Schema, model, Document, Types } from 'mongoose';

export interface IDangKyHoc extends Document {
  hocVien: Types.ObjectId;
  lopHoc: Types.ObjectId;
  ngayBatDau: Date;
  ngayKetThucDuKien?: Date;
  hocPhiMotThangTaiThoiDiemDangKy: number;
  soThangDaDong?: number;
  trangThai: 'dang_doi' | 'dang_hoc' | 'tam_dung' | 'da_ket_thuc';
  ghiChu?: string;
}

const DangKyHocSchema = new Schema<IDangKyHoc>(
  {
    hocVien: {
      type: Schema.Types.ObjectId,
      ref: 'HocVien',
      required: true,
    },
    lopHoc: {
      type: Schema.Types.ObjectId,
      ref: 'LopHoc',
      required: true,
    },
    ngayBatDau: { type: Date, required: true },
    ngayKetThucDuKien: { type: Date },
    hocPhiMotThangTaiThoiDiemDangKy: {
      type: Number,
      required: true,
    },
    soThangDaDong: { type: Number, default: 0 },
    trangThai: {
      type: String,
      enum: ['dang_hoc', 'tam_dung', 'da_ket_thuc'],
      default: 'dang_hoc',
    },
    ghiChu: { type: String },
  },
  { timestamps: true }
);

DangKyHocSchema.index({ hocVien: 1, lopHoc: 1, trangThai: 1 });

export const DangKyHoc = model<IDangKyHoc>('DangKyHoc', DangKyHocSchema);