import { useQuery } from '@tanstack/react-query';
import { Flame, Code2, Brain } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import type { DashboardStats } from '@/types';
import { useAuthStore } from '@/stores/authStore';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-800/50 rounded-md ${className}`} />;
}

export function DashboardPage() {
  const user = useAuthStore(s => s.user);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<DashboardStats>('/analytics/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <Skeleton className="h-[200px] w-full rounded-[24px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[120px] w-full rounded-[24px]" />
          <Skeleton className="h-[120px] w-full rounded-[24px]" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-[24px]" />
      </div>
    );
  }

  // Handle completely empty state
  if (!stats) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-32 text-center">
        <Brain className="h-16 w-16 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Start solving problems to unlock AI insights.</h2>
        <p className="text-muted-foreground max-w-md">
          CodeMentor AI analyzes your submissions to build a personalized readiness profile.
        </p>
      </div>
    );
  }

  const overallReadiness = 84; // Mocked for design since backend API readiness metric is distributed differently, ideally we fetch a top level number.
  const topTopics = stats.topicDistribution.slice(0, 5);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* 1. Readiness Hero */}
      <Card spotlight className="border-violet-500/20 bg-gradient-to-br from-card to-violet-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground text-lg">
              You improved <span className="text-white font-medium">Graph mastery by 12%</span> during the last 14 days.
            </p>
          </div>
          
          <div className="flex-shrink-0 text-center md:text-right">
            <p className="text-sm font-medium text-violet-400 mb-1 uppercase tracking-wider">Interview Readiness</p>
            <div className="text-6xl font-bold text-white">{overallReadiness}<span className="text-3xl text-muted-foreground">%</span></div>
            <p className="text-sm text-emerald-400 mt-2 font-medium">+12 this month</p>
          </div>
        </div>
      </Card>

      {/* 2. Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card spotlight className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">{stats.streak}</p>
              <p className="text-muted-foreground font-medium">days</p>
            </div>
          </div>
          <div className="h-16 w-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card spotlight className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Problems Solved</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white">{stats.totalSolved}</p>
            </div>
          </div>
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Code2 className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      {/* 3. Main Data Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic Mastery */}
        <Card spotlight title="Topic Mastery" className="h-full">
          {topTopics.length > 0 ? (
            <div className="space-y-5 mt-2">
              {topTopics.map((topic, index) => {
                const mastery = Math.floor(Math.random() * 40) + 50; // Mocking % for UI since topicDistribution just gives count currently.
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className="text-slate-200">{topic.topic.replace('_', ' ')}</span>
                      <span className="text-muted-foreground">{mastery}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500 rounded-full" 
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground">No topic data available yet.</div>
          )}
        </Card>

        {/* AI Insights & Recommended Focus */}
        <div className="space-y-6">
          <Card spotlight className="bg-indigo-950/20 border-indigo-500/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/20">
                <Brain className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Focus Area: Graphs</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your graph accuracy is <span className="text-white font-medium">27% below average</span> based on recent submissions. 
                  You are frequently encountering Time Limit Exceeded errors on traversal problems.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-white/5">
                  <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Recommended Review</p>
                  <p className="text-slate-200">BFS, DFS, Union Find Patterns</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievement Highlight */}
          <Card spotlight className="py-5">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Latest Achievement</p>
                <p className="text-white font-bold text-lg">First Hard Problem Solved</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
