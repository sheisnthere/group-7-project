import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import validate from '../middleware/validate';
import verifyToken from '../middleware/authMiddleware';

const router = Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Nama produk wajib diisi'),
  body('price')
    .notEmpty()
    .withMessage('Harga produk wajib diisi')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Harga harus berupa angka >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stok harus berupa bilangan bulat >= 0'),
];

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nama produk tidak boleh kosong'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Harga harus berupa angka >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stok harus berupa bilangan bulat >= 0'),
];

// Public reads
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected writes (JWT required)
router.post('/', verifyToken, productValidation, validate, createProduct);
router.put('/:id', verifyToken, updateValidation, validate, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
