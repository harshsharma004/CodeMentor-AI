import OpenAI from 'openai';
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
  skillLevel: string;
  targetCompany: string;
  hoursPerWeek: number;
}): Promise<{ title: string; description: string; roadmap: object }> {
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

export async function evaluateInterviewAnswer(params: {
  type: string;
  question: string;
  answer: string;
}): Promise<{ score: number; feedback: object }> {
  const prompt = `Evaluate this ${params.type} interview answer and return JSON:
{
  "score": 0-100,
  "feedback": {
    "correctness": "assessment",
    "communication": "assessment",
    "optimization": "assessment",
    "strengths": ["strength1"],
    "improvements": ["improvement1"],
    "overall": "summary"
  }
}

Question: ${params.question}
Answer: ${params.answer}

Return ONLY valid JSON.`;

  const response = await chatCompletion([
    { role: 'system', content: 'You are an interview evaluator. Return only valid JSON.' },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    const wordCount = params.answer.split(/\s+/).length;
    const score = Math.min(85, Math.max(40, wordCount * 2));
    return {
      score,
      feedback: {
        correctness: wordCount > 50 ? 'Good coverage of key concepts' : 'Answer needs more technical depth',
        communication: wordCount > 30 ? 'Clear structure' : 'Try to organize your thoughts better',
        optimization: 'Consider discussing time/space complexity',
        strengths: ['Attempted the problem', 'Showed problem-solving approach'],
        improvements: ['Add more specific examples', 'Discuss edge cases', 'Mention trade-offs'],
        overall: `Score: ${score}/100. Keep practicing and focus on structured responses.`,
      },
    };
  }
}

export async function generateInterviewQuestion(type: string): Promise<string> {
  const prompts: Record<string, string> = {
    DSA: 'Generate one medium-level DSA coding interview question. Include problem statement only, no solution.',
    SYSTEM_DESIGN: 'Generate one system design interview question suitable for mid-level engineers. Include requirements only.',
    BEHAVIORAL: 'Generate one behavioral interview question using the STAR method format. Question only.',
  };

  const response = await chatCompletion([
    { role: 'system', content: 'You are an interview question generator. Be concise.' },
    { role: 'user', content: prompts[type] || prompts.DSA },
  ]);

  return response;
}
