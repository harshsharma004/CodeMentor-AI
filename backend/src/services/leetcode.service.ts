import { prisma } from '../lib/prisma.js';

export async function fetchLeetCodeProfile(username: string) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com'
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  const result = (await response.json()) as any;
  const data = result.data;

  if (result.errors || !data || !data.matchedUser) {
    throw new Error('LeetCode user not found');
  }

  const stats = data.matchedUser.submitStats.acSubmissionNum;
  const contest = data.userContestRanking;

  const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
  const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
  const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
  const total = easy + medium + hard;

  return {
    totalSolved: total,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    contestRating: contest?.rating ? Math.round(contest.rating) : null,
    ranking: contest?.globalRanking || null
  };
}

export async function syncLeetCodeProfile(userId: string, username: string) {
  const stats = await fetchLeetCodeProfile(username);

  return prisma.leetCodeStats.upsert({
    where: { userId },
    update: {
      leetcodeUsername: username,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      contestRating: stats.contestRating,
      ranking: stats.ranking,
      lastSyncedAt: new Date()
    },
    create: {
      userId,
      leetcodeUsername: username,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      contestRating: stats.contestRating,
      ranking: stats.ranking
    }
  });
}

export async function getLeetCodeProfile(userId: string) {
  return prisma.leetCodeStats.findUnique({
    where: { userId }
  });
}
