import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

const signToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'group_7_project';
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    options
  );
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Email sudah terdaftar' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = signToken(newUser);

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: newUser, // password stripped by toJSON transform
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Register error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(400).json({ message: 'Email atau password salah' });
      return;
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(400).json({ message: 'Email atau password salah' });
      return;
    }

    const token = signToken(user);

    res.json({ message: 'Login berhasil', token, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Login error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }
    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('getMe error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};
