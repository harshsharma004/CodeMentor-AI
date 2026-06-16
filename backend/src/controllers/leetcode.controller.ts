import type { Response, NextFunction } from 'express';
import * as leetcodeService from '../services/leetcode.service.js';
import type { AuthRequest } from '../types/index.js';

export async function syncProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { username } = req.body;
    const stats = await leetcodeService.syncLeetCodeProfile(req.user!.id, username);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await leetcodeService.getLeetCodeProfile(req.user!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
