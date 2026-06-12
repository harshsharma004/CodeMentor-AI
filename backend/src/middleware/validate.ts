import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors.js';

export function validate(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted: Record<string, string[]> = {};
    for (const err of errors.array()) {
      const field = 'path' in err ? String(err.path) : 'general';
      if (!formatted[field]) formatted[field] = [];
      formatted[field].push(err.msg);
    }
    next(new AppError(400, 'Validation failed', formatted));
    return;
  }
  next();
}
