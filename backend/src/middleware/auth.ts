import type { NextFunction, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import type { AuthRequest } from '../types/index.js';

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}
