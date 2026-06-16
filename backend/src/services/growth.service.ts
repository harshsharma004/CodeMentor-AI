import { prisma } from '../lib/prisma.js';

export async function getLearningVelocity(userId: string) {
  const now = new Date();
  
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);

  // Solved counts
  const last7DaysSolved = await prisma.solvedProblem.count({
    where: { userId, solvedAt: { gte: sevenDaysAgo } }
  });

  const last30DaysSolved = await prisma.solvedProblem.count({
    where: { userId, solvedAt: { gte: thirtyDaysAgo } }
  });

  const previous30DaysSolved = await prisma.solvedProblem.count({
    where: { userId, solvedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
  });

  // Average solve time (from successful attempts in last 30 days)
  const recentAttempts = await prisma.problemAttempt.findMany({
    where: {
      userId,
      status: 'SUCCESS',
      createdAt: { gte: thirtyDaysAgo },
      solveTime: { not: null }
    },
    select: { solveTime: true }
  });

  let avgSolveTime = 0;
  if (recentAttempts.length > 0) {
    const totalSolveTime = recentAttempts.reduce((acc, curr) => acc + (curr.solveTime || 0), 0);
    avgSolveTime = totalSolveTime / recentAttempts.length;
  }

  // Growth rate (percentage)
  let growthRate = 0;
  if (previous30DaysSolved === 0 && last30DaysSolved > 0) {
    growthRate = 100; // 100% growth from nothing
  } else if (previous30DaysSolved > 0) {
    growthRate = ((last30DaysSolved - previous30DaysSolved) / previous30DaysSolved) * 100;
  }

  // Consistency score (Days active in last 30 days)
  const solvedIn30Days = await prisma.solvedProblem.findMany({
    where: { userId, solvedAt: { gte: thirtyDaysAgo } },
    select: { solvedAt: true }
  });

  const uniqueActiveDays = new Set(
    solvedIn30Days.map(s => {
      const d = new Date(s.solvedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const consistencyScore = Math.round((uniqueActiveDays.size / 30) * 100);

  return {
    last7DaysSolved,
    last30DaysSolved,
    avgSolveTime,
    growthRate: Math.round(growthRate * 100) / 100, // round to 2 decimals
    consistencyScore
  };
}

export async function getReadinessScore(userId: string) {
  // Get required data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true }
  });

  const solvedProblems = await prisma.solvedProblem.findMany({
    where: { userId },
    include: { problem: { select: { difficulty: true } } }
  });

  const topicMasteries = await prisma.topicMastery.findMany({
    where: { userId }
  });

  const leetCodeStats = await prisma.leetCodeStats.findUnique({
    where: { userId }
  });

  const velocity = await getLearningVelocity(userId);

  // Calculate Sub-scores
  const totalSolved = solvedProblems.length;
  const hardSolved = solvedProblems.filter(s => s.problem.difficulty === 'HARD').length;
  const streak = user?.currentStreak || 0;
  const rating = leetCodeStats?.contestRating || 1200; // Default base rating
  
  // Topic Mastery Avg
  let avgMastery = 0;
  if (topicMasteries.length > 0) {
    const total = topicMasteries.reduce((acc, curr) => acc + curr.masteryPct, 0);
    avgMastery = total / topicMasteries.length;
  }

  // Scoring Weights (Max 100)
  // 1. Total Solved (Max 20 pts, cap at 300)
  const scoreSolved = Math.min((totalSolved / 300) * 20, 20);
  
  // 2. Hard Solved (Max 15 pts, cap at 50)
  const scoreHard = Math.min((hardSolved / 50) * 15, 15);
  
  // 3. Topic Mastery (Max 25 pts, cap at 100%)
  const scoreMastery = (avgMastery / 100) * 25;
  
  // 4. Contest Rating (Max 20 pts, baseline 1200, cap at 2000)
  const scoreRating = Math.max(0, Math.min(((rating - 1200) / 800) * 20, 20));

  // 5. Streak & Consistency (Max 10 pts, cap at 30 days)
  const scoreStreak = Math.min((streak / 30) * 10, 10);

  // 6. Velocity / Consistency Score (Max 10 pts, from Consistency Score)
  const scoreVelocity = (velocity.consistencyScore / 100) * 10;

  // Final Score
  const readinessScore = Math.round(
    scoreSolved + scoreHard + scoreMastery + scoreRating + scoreStreak + scoreVelocity
  );

  // Determine Level
  let level = 'Beginner';
  if (readinessScore >= 85) level = 'Elite Candidate';
  else if (readinessScore >= 70) level = 'Interview Ready';
  else if (readinessScore >= 50) level = 'Placement Ready';
  else if (readinessScore >= 30) level = 'Intermediate';

  return {
    score: readinessScore,
    level,
    breakdown: {
      solvedProblems: Math.round(scoreSolved),
      hardProblems: Math.round(scoreHard),
      topicMastery: Math.round(scoreMastery),
      contestRating: Math.round(scoreRating),
      streak: Math.round(scoreStreak),
      velocity: Math.round(scoreVelocity)
    }
  };
}
