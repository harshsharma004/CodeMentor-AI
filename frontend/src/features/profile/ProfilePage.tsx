import { useQuery } from '@tanstack/react-query';
import { Mail, Code2, Flame, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { ProfileStats } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<ProfileStats>('/analytics/profile');
      return res.data;
    },
  });

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    
    setIsUpdating(true);
    try {
      await api.put('/users/profile', { username: usernameInput });
      alert('Username updated successfully! Please refresh.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update username');
    } finally {
      setIsUpdating(false);
    }
  };

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

      <Card className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Public Profile Settings</h3>
        <p className="text-sm text-muted mb-4">Set a unique username to share your public developer profile.</p>
        <form onSubmit={handleUpdateUsername} className="flex gap-3">
          <input 
            type="text" 
            placeholder="Choose a username..." 
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="flex-1 rounded-lg border border-slate-700 bg-surface px-4 py-2 text-white outline-none focus:border-secondary"
          />
          <Button type="submit" disabled={isUpdating}>Save</Button>
        </form>
        {user?.username && (
          <p className="text-sm text-muted mt-3">
            Your public profile: <a href={`/${user.username}`} target="_blank" className="text-secondary hover:underline">localhost:5173/{user.username}</a>
          </p>
        )}
      </Card>
    </div>
  );
}
