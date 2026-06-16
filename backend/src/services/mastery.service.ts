import { prisma } from '../lib/prisma.js';
import type { Topic } from '@prisma/client';

export async function updateTopicMastery(userId: string, topic: Topic) {
  const attempts = await prisma.problemAttempt.findMany({
    where: { userId, topic }
  });
  
  if (attempts.length === 0) return;

  const successfulAttempts = attempts.filter(a => a.status === 'SUCCESS');
  
  // Deduplicate by problemId so a user solving the same easy 10 times doesn't get 100% mastery
  const uniqueSolved = new Map();
  for (const attempt of successfulAttempts) {
    if (!uniqueSolved.has(attempt.problemId)) {
      uniqueSolved.set(attempt.problemId, attempt.difficulty);
    }
  }

  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  for (const difficulty of uniqueSolved.values()) {
    if (difficulty === 'EASY') easySolved++;
    else if (difficulty === 'MEDIUM') mediumSolved++;
    else if (difficulty === 'HARD') hardSolved++;
  }
  
  // Point system: Easy=2, Medium=5, Hard=10. Target = 50 points for 100% mastery.
  const score = (easySolved * 2) + (mediumSolved * 5) + (hardSolved * 10);
  const masteryPct = Math.min(Math.round((score / 50) * 100), 100);
  
  await prisma.topicMastery.upsert({
    where: { userId_topic: { userId, topic } },
    update: { masteryPct, solvedCount: uniqueSolved.size },
    create: { userId, topic, masteryPct, solvedCount: uniqueSolved.size }
  });
}

export async function getAllMastery(userId: string) {
  return prisma.topicMastery.findMany({
    where: { userId },
    orderBy: { masteryPct: 'desc' }
  });
}
