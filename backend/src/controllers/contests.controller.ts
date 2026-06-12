import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';
import type { AuthRequest } from '../types/index.js';

export async function getContests(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const contests = await prisma.contest.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(contests);
  } catch (error) {
    next(error);
  }
}

export async function addContest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { contestName, ranking, rating } = req.body;
    const contest = await prisma.contest.create({
      data: {
        userId: req.user!.id,
        contestName,
        ranking: ranking ? parseInt(ranking, 10) : null,
        rating: rating ? parseInt(rating, 10) : null,
      },
    });
    res.status(201).json(contest);
  } catch (error) {
    next(error);
  }
}

export async function updateContest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const contest = await prisma.contest.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!contest) {
      throw new AppError(404, 'Contest not found');
    }

    const updated = await prisma.contest.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteContest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const contest = await prisma.contest.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!contest) {
      throw new AppError(404, 'Contest not found');
    }

    await prisma.contest.delete({ where: { id } });
    res.json({ message: 'Contest deleted' });
  } catch (error) {
    next(error);
  }
}
