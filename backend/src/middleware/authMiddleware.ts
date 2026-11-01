import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Augment Express Request so req.user is typed everywhere
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'group_7_project';
    const verified = jwt.verify(token, secret) as JwtPayload;
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid atau sudah expired.' });
  }
};

// Allows the request through only when the authenticated user is an admin.
// Must be used after verifyToken.
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Akses khusus admin.' });
    return;
  }
  next();
};

export default verifyToken;
