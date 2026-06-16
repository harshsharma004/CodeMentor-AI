import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { WeaknessAnalysis } from '@/types';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-800/50 rounded-md ${className}`} />;
}

export function AnalyticsPage() {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get<WeaknessAnalysis>('/analytics/weakness');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <Skeleton className="h-[200px] w-full rounded-[24px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-[24px]" />
          <Skeleton className="h-[300px] w-full rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Activity className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your competitive programming metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card spotlight className="col-span-1 lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-white">Topic Distribution</h3>
            <p className="text-sm text-muted-foreground mt-1">Number of problems solved across topics</p>
          </div>
          <div className="p-6 h-[350px]">
            {analysis.topicDistribution.some((t) => t.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.topicDistribution.filter((t) => t.count > 0)} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="topic" stroke="#94A3B8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No data available yet</div>
            )}
          </div>
        </Card>

        <Card spotlight className="space-y-6 bg-gradient-to-br from-card to-violet-900/10 border-violet-500/20">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Recommended Next Topics</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedNextTopics.map((topic) => (
                <Badge key={topic} className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-full text-sm font-medium">
                  {topic.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-border">
             <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Focus Trajectory</h3>
             </div>
             {/* Mocking a tiny sparkline using Recharts */}
             <div className="h-[120px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[ {v: 10}, {v: 25}, {v: 20}, {v: 45}, {v: 60}, {v: 55}, {v: 80} ]}>
                   <Line type="monotone" dataKey="v" stroke="#A855F7" strokeWidth={3} dot={false} />
                   <Tooltip cursor={false} content={<></>} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <p className="text-sm text-muted-foreground text-center mt-2">Momentum is trending upwards.</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card spotlight title="Weakest Topics">
          <div className="space-y-4 mt-2">
            {analysis.weakestTopics.length > 0 ? (
              analysis.weakestTopics.map((t) => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-white font-medium flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-orange-400" />
                      {t.topic.replace('_', ' ')}
                    </span>
                    <span className="text-muted-foreground">{t.count} solved</span>
                  </div>
                  {/* Progress Indicator matching Linear UI */}
                  <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500/80 rounded-full" style={{ width: `${Math.max(10, Math.min(100, t.count * 10))}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-6">Solve more problems to identify weak areas</p>
            )}
          </div>
        </Card>

        <Card spotlight title="Strongest Topics">
          <div className="space-y-4 mt-2">
            {analysis.strongestTopics.map((t) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-white font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    {t.topic.replace('_', ' ')}
                  </span>
                  <span className="text-muted-foreground">{t.count} solved</span>
                </div>
                {/* Progress Indicator matching Linear UI */}
                <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: `${Math.max(10, Math.min(100, t.count * 5))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card spotlight title="Suggested Practice Schedule" className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {analysis.practiceSchedule.map((day) => (
            <div key={day.day} className="p-6 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white tracking-wide">{day.day}</span>
                <Calendar className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Focus Area</p>
                  <p className="text-sm text-indigo-200 font-medium">{day.focus.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-black/40 text-slate-300 border-white/10">{day.problems} problems</Badge>
                </div>
                {day.review && day.review !== 'None' && (
                  <div className="pt-3 border-t border-border mt-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Review</p>
                    <p className="text-sm text-slate-300">{day.review.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
