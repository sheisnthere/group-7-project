import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController';
import validate from '../middleware/validate';
import verifyToken from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').notEmpty().withMessage('Password wajib diisi'),
  ],
  validate,
  login
);

// GET /api/auth/me (protected)
router.get('/me', verifyToken, getMe);

export default router;
