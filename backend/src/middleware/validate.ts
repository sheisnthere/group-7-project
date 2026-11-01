import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Runs after express-validator checks and returns 400 with a clean error list
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validasi gagal',
      errors: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }
  next();
};

export default validate;
