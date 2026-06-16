import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Code2, Flame, Trophy, Calendar, Award } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-800/50 rounded-md ${className}`} />;
}

export function PublicProfilePage() {
  const { username } = useParams();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      const res = await api.get(`/users/${username}`);
      return res.data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <div className="h-64 w-full bg-slate-800/20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <Skeleton className="h-40 w-40 rounded-full border-8 border-background mb-4" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-6xl font-bold mb-4 text-violet-500">404</h1>
        <p className="text-muted-foreground text-lg">Developer profile not found.</p>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-background border-b border-border relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column (Avatar & Basic Info) */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-72">
            <div className="h-40 w-40 rounded-full border-8 border-background bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-6xl font-bold shadow-2xl relative overflow-hidden">
               {/* Inner glow */}
               <div className="absolute inset-0 bg-white/20" />
               <span className="relative z-10 drop-shadow-md">{profile.name.charAt(0).toUpperCase()}</span>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
            <p className="text-violet-400 text-lg font-medium">@{profile.username}</p>
            
            <div className="mt-6 w-full space-y-4 bg-card/50 border border-white/5 p-5 rounded-2xl">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Joined {joinDate}</span>
              </div>
              {profile.leetCodeStats?.contestRating && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Contest Rating: <span className="font-bold text-white">{Math.round(profile.leetCodeStats.contestRating)}</span></span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column (Stats & Data) */}
          <div className="flex-grow mt-8 md:mt-24 space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card spotlight className="p-5 flex flex-col items-center justify-center text-center bg-card">
                <Flame className="h-8 w-8 text-orange-500 mb-3 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                <span className="text-3xl font-bold text-white tracking-tight">{profile.currentStreak}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Current Streak</span>
              </Card>
              <Card spotlight className="p-5 flex flex-col items-center justify-center text-center bg-card">
                <Flame className="h-8 w-8 text-orange-500/40 mb-3" />
                <span className="text-3xl font-bold text-white tracking-tight">{profile.longestStreak}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Longest Streak</span>
              </Card>
              <Card spotlight className="p-5 flex flex-col items-center justify-center text-center bg-card">
                <Code2 className="h-8 w-8 text-emerald-400 mb-3 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                <span className="text-3xl font-bold text-white tracking-tight">{profile.leetCodeStats?.totalSolved || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total Solved</span>
              </Card>
              <Card spotlight className="p-5 flex flex-col items-center justify-center text-center bg-card">
                <Trophy className="h-8 w-8 text-yellow-500 mb-3 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                <span className="text-3xl font-bold text-white tracking-tight">
                  {profile.achievements?.length || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Achievements</span>
              </Card>
            </div>

            {/* Topic Mastery Section */}
            {profile.topicMasteries?.length > 0 && (
              <Card spotlight className="border-violet-500/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <Award className="h-6 w-6 text-violet-400" /> 
                  Top Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {profile.topicMasteries.slice(0, 6).map((tm: any) => {
                    const mastery = Math.round(tm.masteryPct);
                    return (
                      <div key={tm.id}>
                        <div className="flex justify-between items-center mb-2 font-medium">
                          <span className="text-slate-200">{tm.topic.replace('_', ' ')}</span>
                          <span className="text-muted-foreground text-sm">{mastery}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500/80 rounded-full" 
                            style={{ width: `${mastery}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
