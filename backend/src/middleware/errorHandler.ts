import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error: ' + err.message, stack: err.stack });
}
