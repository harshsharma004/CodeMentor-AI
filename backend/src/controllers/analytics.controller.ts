import type { Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service.js';
import * as growthService from '../services/growth.service.js';
import * as masteryService from '../services/mastery.service.js';
import type { AuthRequest } from '../types/index.js';

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await analyticsService.getDashboardStats(req.user!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const analysis = await analyticsService.getWeaknessAnalysis(req.user!.id);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await analyticsService.getProfileStats(req.user!.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function getLeaderboard(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const leaderboard = await analyticsService.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
}

export async function getReadiness(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await growthService.getReadinessScore(req.user!.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getVelocity(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await growthService.getLearningVelocity(req.user!.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getMastery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await masteryService.getAllMastery(req.user!.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
