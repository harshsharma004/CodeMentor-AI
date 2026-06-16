import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../types/index.js';
import { AppError } from '../utils/errors.js';

export async function getPublicProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const username = req.params.username as string;
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        name: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
        leetCodeStats: true,
        topicMasteries: true,
        achievements: true,
        companyPreps: true,
      }
    });

    if (!user) {
      throw new AppError(404, 'Profile not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { username, name } = req.body;

    // Check if username is taken by another user
    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== userId) {
        throw new AppError(409, 'Username is already taken');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(name && { name }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}
