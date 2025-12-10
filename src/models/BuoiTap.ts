import { Schema, model, Document, Types } from 'mongoose';

export interface IBuoiTap extends Document {
  lopHoc: Types.ObjectId;
  ngay: Date; // ngày diễn ra buổi tập
  gioBatDau?: string;
  gioKetThuc?: string;

  giangVienPhuTrach?: Types.ObjectId;

  trangThai: 'du_kien' | 'da_dien_ra' | 'huy';
  ghiChu?: string;
}

const BuoiTapSchema = new Schema<IBuoiTap>(
  {
    lopHoc: {
      type: Schema.Types.ObjectId,
      ref: 'LopHoc',
      required: true,
    },
    ngay: { type: Date, required: true },
    gioBatDau: { type: String },
    gioKetThuc: { type: String },
    giangVienPhuTrach: {
      type: Schema.Types.ObjectId,
      ref: 'NguoiDung',
    },
    trangThai: {
      type: String,
      enum: ['du_kien', 'da_dien_ra', 'huy'],
      default: 'du_kien',
    },
    ghiChu: { type: String },
  },
  { timestamps: true }
);

// Index phục vụ thống kê theo ngày, lớp, giảng viên
BuoiTapSchema.index({ lopHoc: 1, ngay: 1 });
BuoiTapSchema.index({ giangVienPhuTrach: 1, ngay: 1 });

export const BuoiTap = model<IBuoiTap>('BuoiTap', BuoiTapSchema);