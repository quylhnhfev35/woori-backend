import { Schema, model, Document } from 'mongoose';

export interface IHocVien extends Document {
  hoTen: string;
  ngaySinh?: Date;
  gioiTinh?: 'nam' | 'nu' | 'khac';
  soLienHe?: string;
  diaChi?: string;

  capDaiHienTai?: string;   // trắng, vàng, xanh, đỏ, đen...
  ngayThamGia: Date;
  trangThai: 'dang_doi' | 'dang_hoc' | 'tam_nghi' | 'nghi_han';

  nguoiGiamHo?: string;
  soDienThoaiNguoiGiamHo?: string;
  ghiChu?: string;
}

const HocVienSchema = new Schema<IHocVien>(
  {
    hoTen: { type: String, required: true, trim: true },
    ngaySinh: { type: Date },
    gioiTinh: { type: String, enum: ['nam', 'nu', 'khac'] },

    soLienHe: { type: String, trim: true },
    diaChi: { type: String },

    capDaiHienTai: { type: String },
    ngayThamGia: { type: Date, required: true, default: Date.now },
    trangThai: {
      type: String,
      enum: ['dang_doi', 'dang_hoc', 'tam_nghi', 'nghi_han'],
      default: 'dang_hoc',
    },

    nguoiGiamHo: { type: String },
    soDienThoaiNguoiGiamHo: { type: String, trim: true },
    ghiChu: { type: String },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Các index phục vụ tìm kiếm nhanh
HocVienSchema.index({ soLienHe: 1 });
HocVienSchema.index({ soDienThoaiNguoiGiamHo: 1 });
HocVienSchema.index({ hoTen: 'text' });

export const HocVien = model<IHocVien>('HocVien', HocVienSchema);
