import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Code2 } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { LeaderboardEntry } from '@/types';
import { useAuthStore } from '@/stores/authStore';

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-muted font-medium w-5 text-center">{rank}</span>;
}

export function LeaderboardPage() {
  const currentUser = useAuthStore((s) => s.user);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await api.get<LeaderboardEntry[]>('/analytics/leaderboard');
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-muted mt-1">Top coders ranked by problems solved</p>
      </div>

      {!leaderboard?.length ? (
        <EmptyState
          icon={Trophy}
          title="No rankings yet"
          description="Be the first to solve problems and claim the top spot!"
        />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-6 py-4 text-sm font-medium text-muted">Rank</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">User</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">Problems Solved</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">Contest Rating</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.id === currentUser?.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-slate-700/50 ${
                        isCurrentUser ? 'bg-secondary/5' : 'hover:bg-surface/30'
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary text-sm font-semibold">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-medium ${isCurrentUser ? 'text-secondary' : 'text-white'}`}>
                            {entry.name}
                            {isCurrentUser && <span className="text-xs text-muted ml-2">(You)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white">
                          <Code2 className="h-4 w-4 text-muted" />
                          {entry.problemsSolved}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{entry.contestRating || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
