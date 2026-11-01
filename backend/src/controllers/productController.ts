import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

// GET /api/products  (public) - supports ?search= & ?category=
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query as { search?: string; category?: string };
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('getProducts error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id  (public)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID produk tidak valid' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('getProductById error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/products  (protected)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, image, category, stock } = req.body as {
      name: string;
      description?: string;
      price: number;
      image?: string;
      category?: string;
      stock?: number;
    };

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
      createdBy: req.user?._id,
    });

    res.status(201).json({ message: 'Produk berhasil dibuat', product });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('createProduct error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/products/:id  (protected)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID produk tidak valid' });
      return;
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    res.json({ message: 'Produk berhasil diperbarui', product });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('updateProduct error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/products/:id  (protected)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID produk tidak valid' });
      return;
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('deleteProduct error:', message);
    res.status(500).json({ message: 'Server error' });
  }
};
