import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /api/users/me
export const getMe = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      userId: req.user.userId,
      user_name: req.user.user_name,
    },
  });
};
