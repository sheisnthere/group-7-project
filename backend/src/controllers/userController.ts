import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// GET /api/users  (admin) - list all users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('getUsers error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:id  (admin) - single user
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID pengguna tidak valid' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      return;
    }
    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('getUserById error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users  (admin) - create a user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'user' | 'admin';
    };

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Email sudah terdaftar' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
    });

    res.status(201).json({ message: 'Pengguna berhasil dibuat', user });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('createUser error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/:id  (admin) - update a user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID pengguna tidak valid' });
      return;
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: 'user' | 'admin';
    };

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email.toLowerCase();
    if (role !== undefined) update.role = role === 'admin' ? 'admin' : 'user';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      return;
    }

    res.json({ message: 'Pengguna berhasil diperbarui', user });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('updateUser error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/:id  (admin) - delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID pengguna tidak valid' });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      return;
    }

    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('deleteUser error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};
