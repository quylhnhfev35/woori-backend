import { Schema, model, Document, Types } from 'mongoose';

export interface IThanhToan extends Document {
  hocVien: Types.ObjectId;
  lopHoc?: Types.ObjectId;
  dangKyHoc?: Types.ObjectId;
  soTien: number;
  thangNam: string; // "2025-01" để dễ thống kê theo tháng
  ngayThanhToan: Date;
  hinhThuc: 'tien_mat' | 'chuyen_khoan';
  trangThai: 'da_thanh_toan' | 'cho_xac_nhan' | 'huy';
  nguoiThuTien?: Types.ObjectId;
  ghiChu?: string;
}

const ThanhToanSchema = new Schema<IThanhToan>(
  {
    hocVien: {
      type: Schema.Types.ObjectId,
      ref: 'HocVien',
      required: true,
    },
    lopHoc: {
      type: Schema.Types.ObjectId,
      ref: 'LopHoc',
    },
    dangKyHoc: {
      type: Schema.Types.ObjectId,
      ref: 'DangKyHoc',
    },
    soTien: { type: Number, required: true },
    thangNam: {
      type: String,
      required: true,
      // format gợi ý "YYYY-MM"
    },
    ngayThanhToan: { type: Date, required: true, default: Date.now },
    hinhThuc: {
      type: String,
      enum: ['tien_mat', 'chuyen_khoan'],
      default: 'tien_mat',
    },
    trangThai: {
      type: String,
      enum: ['da_thanh_toan', 'cho_xac_nhan', 'huy'],
      default: 'da_thanh_toan',
    },
    nguoiThuTien: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    ghiChu: { type: String },
  },
  { timestamps: true }
);

// Index để thống kê doanh thu theo tháng
ThanhToanSchema.index({ thangNam: 1, trangThai: 1 });
ThanhToanSchema.index({ hocVien: 1, thangNam: 1 });

export const ThanhToan = model<IThanhToan>('ThanhToan', ThanhToanSchema);