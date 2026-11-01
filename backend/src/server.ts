import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS ---
const origins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length > 0 ? origins : true, // true = reflect request origin (allow all)
    credentials: true,
  }),
);

// --- Body parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Marketplace API is running' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// --- 404 handler ---
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// --- Global error handler ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Server error' });
});

// --- Start ---
const start = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Gagal terhubung ke MongoDB:', message);
    // Exit so deployment platforms (Render/Heroku) detect the failed boot.
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

// Only auto-start when this file is run directly (e.g. `npm run dev` / `npm start`),
// not when the app is imported by a test harness.
if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
