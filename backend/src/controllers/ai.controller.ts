import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import * as aiService from '../services/ai.service.js';
import type { AuthRequest } from '../types/index.js';
import type { SkillLevel } from '@prisma/client';

export async function chat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { message } = req.body;

    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: { role: true, content: true },
    });

    const formattedHistory = history.map((m) => ({
      role: m.role.toLowerCase() as 'user' | 'assistant',
      content: m.content,
    }));

    const response = await aiService.getMentorResponse(message, formattedHistory);

    await prisma.chatMessage.createMany({
      data: [
        { userId, role: 'USER', content: message },
        { userId, role: 'ASSISTANT', content: response },
      ],
    });

    res.json({ message: response });
  } catch (error) {
    next(error);
  }
}

export async function getChatHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function clearChatHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    await prisma.chatMessage.deleteMany({ where: { userId } });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    next(error);
  }
}

export async function generateStudyPlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { skillLevel, targetCompany, hoursPerWeek } = req.body;

    const plan = await aiService.generateStudyPlan({
      userId,
      skillLevel,
      targetCompany,
      hoursPerWeek: parseInt(hoursPerWeek, 10),
    });

    const saved = await prisma.studyPlan.create({
      data: {
        userId,
        title: plan.title,
        description: plan.description,
        skillLevel: skillLevel as SkillLevel,
        targetCompany,
        hoursPerWeek: parseInt(hoursPerWeek, 10),
        roadmap: plan.roadmap,
      },
    });

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

export async function getStudyPlans(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const plans = await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(plans);
  } catch (error) {
    next(error);
  }
}

export async function detectWeaknesses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const analysis = await aiService.detectWeaknesses(userId);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
}

export async function reviewCode(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { problemId, code, language } = req.body;
    
    const review = await aiService.reviewCode({ userId, problemId, code, language });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

export async function getCodeReviews(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const reviews = await prisma.codeReview.findMany({
      where: { userId },
      include: { problem: { select: { title: true, difficulty: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function generateExplanation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { problemId } = req.body;
    const explanation = await aiService.generateExplanation(problemId);
    res.json(explanation);
  } catch (error) {
    next(error);
  }
}
