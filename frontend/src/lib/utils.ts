import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTopic(topic: string): string {
  return topic
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return 'text-accent bg-accent/10 border-accent/20';
    case 'MEDIUM':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'HARD':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-muted bg-slate-700/50 border-slate-600';
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { data?: { message?: string } } }).response;
    return resp?.data?.message || 'Something went wrong';
  }
  return 'Something went wrong';
}
