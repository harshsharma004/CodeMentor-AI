import type { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
