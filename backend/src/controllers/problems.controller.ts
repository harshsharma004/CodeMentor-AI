import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';
import type { AuthRequest } from '../types/index.js';
import type { Difficulty, Topic, Prisma } from '@prisma/client';
import * as masteryService from '../services/mastery.service.js';
import * as problemsService from '../services/problems.service.js';

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
      data: { userId, problemId: problem.id },
      include: { problem: true },
    });

    if (notes) {
      await prisma.problemNote.create({
        data: { userId, problemId: problem.id, revisionNotes: notes },
      });
    }

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

    if (notes !== undefined) {
      await prisma.problemNote.upsert({
        where: { userId_problemId: { userId, problemId: solved.problemId } },
        create: { userId, problemId: solved.problemId, revisionNotes: notes },
        update: { revisionNotes: notes },
      });
    }

    const updated = await prisma.solvedProblem.findUnique({
      where: { id },
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

export async function addProblemAttempt(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { title, difficulty, topic, status, solveTime, hintsUsed, leetcodeUrl } = req.body;

    // Find or create problem
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

    // Log the attempt
    const attempt = await prisma.problemAttempt.create({
      data: {
        userId,
        problemId: problem.id,
        status: status.toUpperCase(),
        solveTime: solveTime ? Number(solveTime) : null,
        hintsUsed: hintsUsed ? Number(hintsUsed) : 0,
        difficulty: problem.difficulty,
        topic: problem.topic,
      }
    });

    // If success, automatically log it to SolvedProblem if not already solved
    if (status.toUpperCase() === 'SUCCESS') {
      const existingSolved = await prisma.solvedProblem.findUnique({
        where: { userId_problemId: { userId, problemId: problem.id } },
      });

      if (!existingSolved) {
        await prisma.solvedProblem.create({
          data: { userId, problemId: problem.id },
        });
      }
    }

    // Recalculate Topic Mastery asynchronously
    masteryService.updateTopicMastery(userId, problem.topic).catch(console.error);

    res.status(201).json(attempt);
  } catch (error) {
    next(error);
  }
}

export async function getDailyChallenge(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const challenge = await problemsService.generateDailyChallenge(userId);
    res.json(challenge);
  } catch (error) {
    next(error);
  }
}
