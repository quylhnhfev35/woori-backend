import { Request, Response } from 'express';
import { IUser, UserModel } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';

// DTO cho body
interface RegisterBody {
  user_name: string;
  password: string;
  hoTen: string;
  soDienThoai?: string;
}

interface LoginBody {
  user_name: string;
  password: string;
}

// POST /api/auth/register
export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { user_name, password, hoTen, soDienThoai } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đăng nhập và mật khẩu!',
      });
    }

    const existingUser = await UserModel.findOne({ user_name });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Tên tài khoản đã tồn tại!',
      });
    }

    const hashed = await hashPassword(password);

    const newUser = await UserModel.create({
      user_name,
      password: hashed,
      hoTen,
      soDienThoai,
    } as IUser);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        id: newUser._id,
        user_name: newUser.user_name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// POST /api/auth/login
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đăng nhập và mật khẩu!',
      });
    }

    const user = await UserModel.findOne({ user_name }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu',
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu',
      });
    }

    if (user.trangThai === false) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên!',
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      user_name: user.user_name,
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};