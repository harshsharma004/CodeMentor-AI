import OpenAI from 'openai';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

const openai = env.openaiApiKey
  ? new OpenAI({ apiKey: env.openaiApiKey })
  : null;

const SYSTEM_PROMPT = `You are CodeMentor AI, an expert coding interview mentor and LeetCode tutor.
You help users understand algorithms, data structures, and problem-solving strategies.
Be concise, clear, and educational. Use code examples when helpful.
Focus on interview preparation and practical problem-solving skills.`;

async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
  if (!openai) {
    return getMockResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || 'I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new AppError(503, 'AI service temporarily unavailable');
  }
}

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hint')) {
    return '**Hint:** Start by identifying the pattern. Consider using a hash map to track seen elements for O(n) time complexity. Think about what invariant you need to maintain as you iterate.';
  }
  if (lower.includes('binary search')) {
    return '**Binary Search** works on sorted arrays by repeatedly halving the search space. Time: O(log n), Space: O(1). Key template: left=0, right=n-1, while left<=right, mid=(left+right)/2.';
  }
  if (lower.includes('dynamic programming') || lower.includes('dp')) {
    return '**DP Approach:** 1) Define state (what subproblem?), 2) Find recurrence relation, 3) Identify base cases, 4) Choose top-down (memoization) or bottom-up (tabulation). Start with brute force, then optimize overlapping subproblems.';
  }
  return `Great question! Here's a structured approach:\n\n1. **Understand** the problem constraints and edge cases\n2. **Brute force** first to verify correctness\n3. **Optimize** using appropriate data structures\n4. **Analyze** time and space complexity\n\nWould you like me to dive deeper into any specific aspect? (Configure OPENAI_API_KEY for full AI responses)`;
}

export async function getMentorResponse(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];
  return chatCompletion(messages);
}

export async function generateStudyPlan(params: {
  userId: string;
  skillLevel: string;
  targetCompany: string;
  hoursPerWeek: number;
}): Promise<{ title: string; description: string; roadmap: object }> {
  const masteries = await prisma.topicMastery.findMany({
    where: { userId: params.userId },
    orderBy: { masteryPct: 'asc' },
    take: 5
  });
  const weakTopics = masteries.map(m => m.topic).join(', ') || 'None recorded yet';

  const prompt = `Generate a detailed coding interview study plan as JSON with this structure:
{
  "title": "string",
  "description": "string",
  "roadmap": {
    "timeline": "string",
    "weeks": [
      {
        "week": 1,
        "topics": ["topic1"],
        "problems": [{"title": "Problem Name", "difficulty": "Easy", "topic": "Arrays"}],
        "goals": ["goal1"]
      }
    ],
    "recommendedTopics": ["topic1"],
    "tips": ["tip1"]
  }
}

User profile:
- Skill Level: ${params.skillLevel}
- Target Company: ${params.targetCompany}
- Hours per week: ${params.hoursPerWeek}
- Known Weaknesses to Prioritize: ${weakTopics}

Return ONLY valid JSON, no markdown.`;

  const response = await chatCompletion([
    { role: 'system', content: 'You are a study plan generator. Return only valid JSON.' },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      title: `${params.targetCompany} Interview Prep`,
      description: `A ${params.skillLevel.toLowerCase()}-level study plan targeting ${params.targetCompany}, ${params.hoursPerWeek} hours/week.`,
      roadmap: {
        timeline: '12 weeks',
        weeks: [
          {
            week: 1,
            topics: ['Arrays', 'Strings'],
            problems: [
              { title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays' },
              { title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings' },
            ],
            goals: ['Master array fundamentals', 'Practice hash map patterns'],
          },
          {
            week: 2,
            topics: ['Trees', 'Graphs'],
            problems: [
              { title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Trees' },
              { title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs' },
            ],
            goals: ['BFS/DFS traversal', 'Tree recursion patterns'],
          },
        ],
        recommendedTopics: ['Arrays', 'Strings', 'Trees', 'DP', 'Graphs'],
        tips: [
          `Focus on ${params.targetCompany}'s common question patterns`,
          'Practice 2-3 problems daily consistently',
          'Review solutions and optimize after solving',
        ],
      },
    };
  }
}

export async function detectWeaknesses(userId: string) {
  const masteries = await prisma.topicMastery.findMany({
    where: { userId }
  });
  
  const recentAttempts = await prisma.problemAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const prompt = `Analyze this user's LeetCode preparation data and provide a weakness analysis.
Return JSON ONLY with this exact structure:
{
  "weaknesses": ["list of weak topics or patterns"],
  "strengths": ["list of strong topics"],
  "recommendedFocus": "A short paragraph on what to focus on next",
  "summary": "Overall summary of their progress"
}

Topic Mastery Data:
${JSON.stringify(masteries.map(m => ({ topic: m.topic, mastery: m.masteryPct })), null, 2)}

Recent Attempts:
${JSON.stringify(recentAttempts.map(a => ({ topic: a.topic, status: a.status, difficulty: a.difficulty, time: a.solveTime })), null, 2)}
`;

  const response = await chatCompletion([
    { role: 'system', content: "You are an expert technical interviewer and AI mentor analyzing a student's coding progress. Return only valid JSON." },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      weaknesses: ["Not enough data to determine"],
      strengths: ["Keep practicing!"],
      recommendedFocus: "Continue solving problems to gather more data.",
      summary: "AI analysis could not be completed."
    };
  }
}

export async function reviewCode(params: {
  userId: string;
  problemId: string;
  code: string;
  language: string;
}) {
  const problem = await prisma.problem.findUnique({ where: { id: params.problemId } });
  if (!problem) throw new AppError(404, 'Problem not found');

  const prompt = `Review this ${params.language} code for the LeetCode problem "${problem.title}" (Difficulty: ${problem.difficulty}, Topic: ${problem.topic}).
Provide a code review formatted as JSON.
Format exactly like this:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "score": 85,
  "feedback": "Your markdown formatted feedback explaining correctness, the core pattern used (e.g., Sliding Window), key insights, and optimizations."
}

Code:
${params.code}
`;

  const response = await chatCompletion([
    { role: 'system', content: 'You are an expert technical interviewer reviewing code. Return only valid JSON.' },
    { role: 'user', content: prompt }
  ]);

  let parsed: any;
  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      timeComplexity: "Unknown",
      spaceComplexity: "Unknown",
      score: 70,
      feedback: "Good effort! The AI was unable to structure the feedback properly, but be sure to verify your time and space complexity."
    };
  }

  const review = await prisma.codeReview.create({
    data: {
      userId: params.userId,
      problemId: params.problemId,
      code: params.code,
      language: params.language,
      timeComplexity: parsed.timeComplexity,
      spaceComplexity: parsed.spaceComplexity,
      score: parsed.score,
      feedback: parsed.feedback
    }
  });

  return review;
}

export async function generateExplanation(problemId: string) {
  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem) throw new AppError(404, 'Problem not found');

  const prompt = `Provide a brief explanation for the LeetCode problem "${problem.title}" (Topic: ${problem.topic}).
Return ONLY valid JSON with this exact structure:
{
  "pattern": "Name of the core algorithm or pattern (e.g., Sliding Window, BFS, Two Pointers)",
  "keyInsight": "A 1-2 sentence explanation of the main trick or insight required to solve this optimally."
}`;

  const response = await chatCompletion([
    { role: 'system', content: 'You are an AI coding mentor. Return only valid JSON.' },
    { role: 'user', content: prompt }
  ]);

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      pattern: problem.topic.replace('_', ' '),
      keyInsight: "Focus on understanding the core properties of this topic to solve this problem efficiently."
    };
  }
}
