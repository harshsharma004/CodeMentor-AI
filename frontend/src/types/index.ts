export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Topic =
  | 'ARRAYS'
  | 'STRINGS'
  | 'HASHMAP'
  | 'TREES'
  | 'GRAPHS'
  | 'DP'
  | 'GREEDY'
  | 'BACKTRACKING'
  | 'SLIDING_WINDOW'
  | 'BINARY_SEARCH';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  leetcodeUrl?: string | null;
}

export interface SolvedProblem {
  id: string;
  userId: string;
  problemId: string;
  problem: Problem;
  solvedAt: string;
  notes?: string | null;
}

export interface DashboardStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  weeklyProgress: { week: string; count: number }[];
  contestRating: number | null;
  topicDistribution: { topic: string; count: number }[];
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  solvedTrend: { month: string; count: number }[];
}

export interface WeaknessAnalysis {
  weakestTopics: { topic: string; count: number }[];
  strongestTopics: { topic: string; count: number }[];
  recommendedNextTopics: string[];
  practiceSchedule: { day: string; focus: string; problems: number; review: string }[];
  topicDistribution: { topic: string; count: number }[];
}

export interface ProfileStats {
  id: string;
  name: string;
  email: string;
  problemsSolved: number;
  streak: number;
  contestRating: number | null;
  strongestTopic: string;
  weakestTopic: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  problemsSolved: number;
  contestRating: number;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  skillLevel: string;
  targetCompany?: string | null;
  hoursPerWeek: number;
  roadmap: StudyRoadmap;
  createdAt: string;
}

export interface StudyRoadmap {
  timeline: string;
  weeks: {
    week: number;
    topics: string[];
    problems: { title: string; difficulty: string; topic: string }[];
    goals: string[];
  }[];
  recommendedTopics: string[];
  tips: string[];
}

export interface MockInterview {
  id: string;
  type: 'DSA' | 'SYSTEM_DESIGN' | 'BEHAVIORAL';
  question: string;
  answer: string;
  score: number | null;
  feedback: MockFeedback | null;
  createdAt: string;
}

export interface MockFeedback {
  correctness: string;
  communication: string;
  optimization: string;
  strengths: string[];
  improvements: string[];
  overall: string;
}

export const TOPICS: { value: Topic; label: string }[] = [
  { value: 'ARRAYS', label: 'Arrays' },
  { value: 'STRINGS', label: 'Strings' },
  { value: 'HASHMAP', label: 'HashMap' },
  { value: 'TREES', label: 'Trees' },
  { value: 'GRAPHS', label: 'Graphs' },
  { value: 'DP', label: 'DP' },
  { value: 'GREEDY', label: 'Greedy' },
  { value: 'BACKTRACKING', label: 'Backtracking' },
  { value: 'SLIDING_WINDOW', label: 'Sliding Window' },
  { value: 'BINARY_SEARCH', label: 'Binary Search' },
];

export const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'EASY', label: 'Easy', color: 'text-accent' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-400' },
  { value: 'HARD', label: 'Hard', color: 'text-red-400' },
];
