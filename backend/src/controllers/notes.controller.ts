import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../types/index.js';

export async function getNotes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const notes = await prisma.problemNote.findMany({
      where: { userId },
      include: {
        problem: { select: { title: true, difficulty: true, topic: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNoteByProblem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { problemId } = req.params;
    
    const note = await prisma.problemNote.findUnique({
      where: {
        userId_problemId: { userId, problemId }
      },
      include: {
        problem: { select: { title: true, difficulty: true, topic: true } },
      }
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found for this problem' });
    }
    
    res.json(note);
  } catch (error) {
    next(error);
  }
}

export async function upsertNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { problemId, approach, mistakes, revisionNotes } = req.body;

    const note = await prisma.problemNote.upsert({
      where: {
        userId_problemId: { userId, problemId }
      },
      update: {
        approach,
        mistakes,
        revisionNotes
      },
      create: {
        userId,
        problemId,
        approach,
        mistakes,
        revisionNotes
      }
    });

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const note = await prisma.problemNote.findUnique({ where: { id } });
    if (!note || note.userId !== userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await prisma.problemNote.delete({ where: { id } });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
}
