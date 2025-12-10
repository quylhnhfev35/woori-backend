import { Schema, model, Document } from 'mongoose';

// Interface TypeScript cho PhongTap
export interface IPhongTap extends Document {
  tenPhong: string;
  diaChi?: string;
  sucChuaToiDa?: number;
  moTa?: string;
  dangHoatDong: boolean;
  ghiChu?: string;
}

const PhongTapSchema = new Schema<IPhongTap>(
  {
    tenPhong: { type: String, required: true, trim: true, unique: true },
    diaChi: { type: String, trim: true },
    sucChuaToiDa: { type: Number, min: 1 },
    moTa: { type: String },
    dangHoatDong: { type: Boolean, default: true },
    ghiChu: { type: String },
  },
  {
    timestamps: true,
  }
);

PhongTapSchema.index({ tenPhong: 1, dangHoatDong: 1 });

export const PhongTap = model<IPhongTap>('PhongTap', PhongTapSchema);