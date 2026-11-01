import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import validate from '../middleware/validate';
import verifyToken, { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

const createValidation = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role tidak valid'),
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('email').optional().isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role tidak valid'),
];

// All user-management routes require an authenticated admin.
router.use(verifyToken, requireAdmin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createValidation, validate, createUser);
router.put('/:id', updateValidation, validate, updateUser);
router.delete('/:id', deleteUser);

export default router;
