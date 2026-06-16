import { prisma } from '../lib/prisma.js';
import type { Topic, Difficulty } from '@prisma/client';

const TOPIC_LABELS: Record<Topic, string> = {
  ARRAYS: 'Arrays',
  STRINGS: 'Strings',
  LINKED_LISTS: 'Linked Lists',
  STACK: 'Stack',
  QUEUE: 'Queue',
  TREES: 'Trees',
  BST: 'BST',
  GRAPHS: 'Graphs',
  DP: 'DP',
  GREEDY: 'Greedy',
  BACKTRACKING: 'Backtracking',
  SLIDING_WINDOW: 'Sliding Window',
  BINARY_SEARCH: 'Binary Search',
  HEAP: 'Heap',
  TRIE: 'Trie',
  HASHMAP: 'HashMap',
};

export async function getDashboardStats(userId: string) {
  const solved = await prisma.solvedProblem.findMany({
    where: { userId },
    include: { problem: true },
    orderBy: { solvedAt: 'desc' },
  });

  const easy = solved.filter((s) => s.problem.difficulty === 'EASY').length;
  const medium = solved.filter((s) => s.problem.difficulty === 'MEDIUM').length;
  const hard = solved.filter((s) => s.problem.difficulty === 'HARD').length;

  const streak = calculateStreak(solved.map((s) => s.solvedAt));
  const weeklyProgress = getWeeklyProgress(solved);

  const contests = await prisma.contest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  const topicCounts = getTopicCounts(solved);
  const difficultyBreakdown = { easy, medium, hard };
  const trend = getSolvedTrend(solved);

  return {
    totalSolved: solved.length,
    easy,
    medium,
    hard,
    streak,
    weeklyProgress,
    contestRating: contests[0]?.rating ?? null,
    topicDistribution: topicCounts,
    difficultyBreakdown,
    solvedTrend: trend,
  };
}

export async function getWeaknessAnalysis(userId: string) {
  const solved = await prisma.solvedProblem.findMany({
    where: { userId },
    include: { problem: true },
  });

  const topicCounts: Record<string, number> = {};
  for (const s of solved) {
    const label = TOPIC_LABELS[s.problem.topic];
    topicCounts[label] = (topicCounts[label] || 0) + 1;
  }

  const allTopics = Object.values(TOPIC_LABELS);
  const topicScores = allTopics.map((topic) => ({
    topic,
    count: topicCounts[topic] || 0,
  }));

  topicScores.sort((a, b) => a.count - b.count);

  const weakest = topicScores.slice(0, 3).filter((t) => t.count < 5);
  const strongest = [...topicScores].sort((a, b) => b.count - a.count).slice(0, 3);

  const recommended = weakest.map((t) => t.topic);
  const schedule = generatePracticeSchedule(weakest, strongest);

  return {
    weakestTopics: weakest,
    strongestTopics: strongest,
    recommendedNextTopics: recommended.length > 0 ? recommended : ['Arrays', 'Strings'],
    practiceSchedule: schedule,
    topicDistribution: topicScores,
  };
}

export async function getProfileStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) return null;

  const solved = await prisma.solvedProblem.findMany({
    where: { userId },
    include: { problem: true },
  });

  const contests = await prisma.contest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  const topicCounts: Record<string, number> = {};
  for (const s of solved) {
    const label = TOPIC_LABELS[s.problem.topic];
    topicCounts[label] = (topicCounts[label] || 0) + 1;
  }

  const sorted = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const strongestTopic = sorted[0]?.[0] || 'N/A';
  const weakestEntries = Object.entries(topicCounts).sort((a, b) => a[1] - b[1]);
  const allTopics = Object.values(TOPIC_LABELS);
  const weakestTopic =
    weakestEntries[0]?.[0] ||
    allTopics.find((t) => !topicCounts[t]) ||
    'Arrays';

  return {
    ...user,
    problemsSolved: solved.length,
    streak: calculateStreak(solved.map((s) => s.solvedAt)),
    contestRating: contests[0]?.rating ?? null,
    strongestTopic,
    weakestTopic,
  };
}

export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { solvedProblems: true } },
      contests: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { rating: true },
      },
    },
  });

  return users
    .map((u) => ({
      id: u.id,
      name: u.name,
      problemsSolved: u._count.solvedProblems,
      contestRating: u.contests[0]?.rating ?? 0,
    }))
    .sort((a, b) => b.problemsSolved - a.problemsSolved || b.contestRating - a.contestRating)
    .slice(0, 50);
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = new Set(
    dates.map((d) => {
      const date = new Date(d);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(check.getDate() - i);
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (uniqueDays.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

function getWeeklyProgress(solved: { solvedAt: Date }[]) {
  const weeks: { week: string; count: number }[] = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const count = solved.filter((s) => {
      const d = new Date(s.solvedAt);
      return d >= weekStart && d < weekEnd;
    }).length;

    weeks.push({
      week: `Week ${4 - i}`,
      count,
    });
  }

  return weeks;
}

function getTopicCounts(solved: { problem: { topic: Topic } }[]) {
  const counts: Record<string, number> = {};
  for (const s of solved) {
    const label = TOPIC_LABELS[s.problem.topic];
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts).map(([topic, count]) => ({ topic, count }));
}

function getSolvedTrend(solved: { solvedAt: Date }[]) {
  const months: Record<string, number> = {};
  for (const s of solved) {
    const d = new Date(s.solvedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  }

  const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-6).map(([month, count]) => ({ month, count }));
}

function generatePracticeSchedule(
  weakest: { topic: string; count: number }[],
  strongest: { topic: string; count: number }[]
) {
  const schedule = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < 7; i++) {
    const focusTopic = weakest[i % Math.max(weakest.length, 1)]?.topic || 'Arrays';
    schedule.push({
      day: days[i],
      focus: focusTopic,
      problems: 2 + (i % 2),
      review: strongest[0]?.topic || 'General Review',
    });
  }

  return schedule;
}

export { TOPIC_LABELS };
