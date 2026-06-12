import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';
import type { AuthRequest } from '../types/index.js';
import type { Difficulty, Topic, Prisma } from '@prisma/client';

export async function getProblems(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { search, topic, difficulty } = req.query;
    const userId = req.user!.id;

    const where: Prisma.SolvedProblemWhereInput = { userId };

    if (search) {
      where.problem = {
        title: { contains: String(search), mode: 'insensitive' },
      };
    }
    if (topic) {
      where.problem = {
        ...((where.problem as Prisma.ProblemWhereInput) || {}),
        topic: String(topic).toUpperCase() as Topic,
      };
    }
    if (difficulty) {
      where.problem = {
        ...((where.problem as Prisma.ProblemWhereInput) || {}),
        difficulty: String(difficulty).toUpperCase() as Difficulty,
      };
    }

    const solved = await prisma.solvedProblem.findMany({
      where,
      include: { problem: true },
      orderBy: { solvedAt: 'desc' },
    });

    res.json(solved);
  } catch (error) {
    next(error);
  }
}

export async function addSolvedProblem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { title, difficulty, topic, leetcodeUrl, notes } = req.body;

    let problem = await prisma.problem.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    });

    if (!problem) {
      problem = await prisma.problem.create({
        data: {
          title,
          difficulty: difficulty.toUpperCase() as Difficulty,
          topic: topic.toUpperCase().replace(' ', '_') as Topic,
          leetcodeUrl,
        },
      });
    }

    const existing = await prisma.solvedProblem.findUnique({
      where: { userId_problemId: { userId, problemId: problem.id } },
    });

    if (existing) {
      throw new AppError(409, 'Problem already marked as solved');
    }

    const solved = await prisma.solvedProblem.create({
      data: { userId, problemId: problem.id, notes },
      include: { problem: true },
    });

    res.status(201).json(solved);
  } catch (error) {
    next(error);
  }
}

export async function updateSolvedProblem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = String(req.params.id);
    const { notes, title, difficulty, topic, leetcodeUrl } = req.body;

    const solved = await prisma.solvedProblem.findFirst({
      where: { id, userId },
      include: { problem: true },
    });

    if (!solved) {
      throw new AppError(404, 'Solved problem not found');
    }

    if (title || difficulty || topic || leetcodeUrl !== undefined) {
      await prisma.problem.update({
        where: { id: solved.problemId },
        data: {
          ...(title && { title }),
          ...(difficulty && { difficulty: difficulty.toUpperCase() as Difficulty }),
          ...(topic && { topic: topic.toUpperCase().replace(' ', '_') as Topic }),
          ...(leetcodeUrl !== undefined && { leetcodeUrl }),
        },
      });
    }

    const updated = await prisma.solvedProblem.update({
      where: { id },
      data: { ...(notes !== undefined && { notes }) },
      include: { problem: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteSolvedProblem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const id = String(req.params.id);

    const solved = await prisma.solvedProblem.findFirst({
      where: { id, userId },
    });

    if (!solved) {
      throw new AppError(404, 'Solved problem not found');
    }

    await prisma.solvedProblem.delete({ where: { id } });
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    next(error);
  }
}
