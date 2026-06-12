import type { Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import type { AuthRequest } from '../types/index.js';

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
