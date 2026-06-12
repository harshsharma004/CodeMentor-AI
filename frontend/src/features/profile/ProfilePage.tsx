import { useQuery } from '@tanstack/react-query';
import { Mail, Code2, Flame, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { ProfileStats } from '@/types';

export function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<ProfileStats>('/analytics/profile');
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;
  if (!profile) return null;

  const stats = [
    { label: 'Problems Solved', value: profile.problemsSolved, icon: Code2, color: 'text-secondary' },
    { label: 'Current Streak', value: `${profile.streak} days`, icon: Flame, color: 'text-orange-400' },
    { label: 'Contest Rating', value: profile.contestRating ?? 'N/A', icon: Trophy, color: 'text-yellow-400' },
    { label: 'Strongest Topic', value: profile.strongestTopic, icon: TrendingUp, color: 'text-accent' },
    { label: 'Weakest Topic', value: profile.weakestTopic, icon: TrendingDown, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-muted mt-1">Your coding journey overview</p>
      </div>

      <Card>
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20 text-3xl font-bold text-secondary">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-muted">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
            <p className="text-sm text-muted mt-2">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-surface p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
