import { Schema, model, Document, Types } from 'mongoose';

export interface IDiemDanh extends Document {
  buoiTap: Types.ObjectId;
  hocVien: Types.ObjectId;
  trangThai: 'co_mat' | 'vang_co_phep' | 'vang_khong_phep' | 'tre';
  thoiGianDiemDanh: Date;
  ghiChu?: string;
}

const DiemDanhSchema = new Schema<IDiemDanh>(
  {
    buoiTap: {
      type: Schema.Types.ObjectId,
      ref: 'BuoiTap',
      required: true,
    },
    hocVien: {
      type: Schema.Types.ObjectId,
      ref: 'HocVien',
      required: true,
    },
    trangThai: {
      type: String,
      enum: ['co_mat', 'vang_co_phep', 'vang_khong_phep', 'tre'],
      required: true,
      default: 'co_mat',
    },
    thoiGianDiemDanh: { type: Date, default: Date.now },
    ghiChu: { type: String },
  },
  { timestamps: true }
);

// Mỗi học viên chỉ có 1 bản ghi điểm danh / 1 buổi
DiemDanhSchema.index({ buoiTap: 1, hocVien: 1 }, { unique: true });
DiemDanhSchema.index({ hocVien: 1, thoiGianDiemDanh: -1 });

export const DiemDanh = model<IDiemDanh>('DiemDanh', DiemDanhSchema);