import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: { name: 'Alice Chen', email: 'alice@example.com', password },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: { name: 'Bob Kumar', email: 'bob@example.com', password },
    }),
    prisma.user.upsert({
      where: { email: 'demo@codementor.ai' },
      update: {},
      create: { name: 'Demo User', email: 'demo@codementor.ai', password },
    }),
  ]);

  const problems = await Promise.all([
    prisma.problem.upsert({
      where: { id: 'seed-two-sum' },
      update: {},
      create: {
        id: 'seed-two-sum',
        title: 'Two Sum',
        difficulty: 'EASY',
        topic: 'ARRAYS',
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
      },
    }),
    prisma.problem.upsert({
      where: { id: 'seed-valid-anagram' },
      update: {},
      create: {
        id: 'seed-valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'EASY',
        topic: 'STRINGS',
        leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
      },
    }),
    prisma.problem.upsert({
      where: { id: 'seed-lru-cache' },
      update: {},
      create: {
        id: 'seed-lru-cache',
        title: 'LRU Cache',
        difficulty: 'MEDIUM',
        topic: 'HASHMAP',
        leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
      },
    }),
    prisma.problem.upsert({
      where: { id: 'seed-invert-tree' },
      update: {},
      create: {
        id: 'seed-invert-tree',
        title: 'Invert Binary Tree',
        difficulty: 'EASY',
        topic: 'TREES',
        leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
      },
    }),
    prisma.problem.upsert({
      where: { id: 'seed-climbing-stairs' },
      update: {},
      create: {
        id: 'seed-climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'EASY',
        topic: 'DP',
        leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
      },
    }),
  ]);

  const demoUser = users[2];
  for (const problem of problems) {
    await prisma.solvedProblem.upsert({
      where: {
        userId_problemId: { userId: demoUser.id, problemId: problem.id },
      },
      update: {},
      create: {
        userId: demoUser.id,
        problemId: problem.id,
      },
    });

    await prisma.problemNote.upsert({
      where: {
        userId_problemId: { userId: demoUser.id, problemId: problem.id },
      },
      update: {},
      create: {
        userId: demoUser.id,
        problemId: problem.id,
        revisionNotes: 'Solved using optimal approach',
      },
    });
  }

  await prisma.contest.create({
    data: {
      userId: demoUser.id,
      contestName: 'Weekly Contest 400',
      ranking: 1250,
      rating: 1650,
    },
  });

  console.log('Seed completed:', { users: users.length, problems: problems.length });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
