import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  user_name: string;
  password: string;
  hoTen: string;
  soDienThoai?: string;
  trangThai?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    hoTen: { type: String, required: true, trim: true },
    soDienThoai: { type: String, trim: true },
    trangThai: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Loại bỏ password khi chuyển sang JSON
UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);