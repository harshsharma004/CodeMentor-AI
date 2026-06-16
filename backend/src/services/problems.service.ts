import { prisma } from '../lib/prisma.js';
import type { Topic, Difficulty, Problem } from '@prisma/client';

export async function generateDailyChallenge(userId: string) {
  const masteries = await prisma.topicMastery.findMany({
    where: { userId },
    orderBy: { masteryPct: 'asc' },
    take: 3
  });

  const fallbackTopics: Topic[] = ['ARRAYS', 'STRINGS', 'HASHMAP'];
  const weakTopics = masteries.length > 0
    ? masteries.map(m => m.topic)
    : fallbackTopics;

  const userSolved = await prisma.solvedProblem.findMany({
    where: { userId },
    select: { problemId: true }
  });
  const solvedIds = userSolved.map(s => s.problemId);

  async function getProblem(difficulty: Difficulty, topicPref: Topic): Promise<Problem | null> {
    let prob = await prisma.problem.findFirst({
      where: {
        difficulty,
        topic: topicPref,
        id: { notIn: solvedIds }
      }
    });

    if (!prob) {
      prob = await prisma.problem.findFirst({
        where: {
          difficulty,
          id: { notIn: solvedIds }
        }
      });
    }

    if (!prob) {
      prob = await prisma.problem.findFirst({
        where: { difficulty }
      });
    }

    return prob;
  }

  const easy = await getProblem('EASY', weakTopics[0] || fallbackTopics[0]);
  const medium = await getProblem('MEDIUM', weakTopics[1] || fallbackTopics[1]);
  const hard = await getProblem('HARD', weakTopics[2] || fallbackTopics[2]);

  return {
    date: new Date().toISOString().split('T')[0],
    problems: {
      easy,
      medium,
      hard
    }
  };
}
