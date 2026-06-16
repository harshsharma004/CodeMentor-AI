import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function formatTopic(topic: string): string {
  return topic.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'MEDIUM':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'HARD':
      return 'text-red-500 bg-red-500/10 border-red-500/20';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
}
