import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import type { WeaknessAnalysis } from '@/types';

export function AnalyticsPage() {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get<WeaknessAnalysis>('/analytics/weakness');
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Weakness Analyzer</h1>
        <p className="text-muted mt-1">Identify gaps and optimize your study focus</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weakest Topics" description="Areas needing more practice">
          <div className="space-y-3">
            {analysis.weakestTopics.length > 0 ? (
              analysis.weakestTopics.map((t) => (
                <div key={t.topic} className="flex items-center justify-between rounded-lg bg-surface/50 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    <span className="text-white font-medium">{t.topic}</span>
                  </div>
                  <Badge variant="danger">{t.count} solved</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">Solve more problems to identify weak areas</p>
            )}
          </div>
        </Card>

        <Card title="Strongest Topics" description="Your areas of expertise">
          <div className="space-y-3">
            {analysis.strongestTopics.map((t) => (
              <div key={t.topic} className="flex items-center justify-between rounded-lg bg-surface/50 p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-white font-medium">{t.topic}</span>
                </div>
                <Badge variant="success">{t.count} solved</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recommended Next Topics">
        <div className="flex flex-wrap gap-2">
          {analysis.recommendedNextTopics.map((topic) => (
            <Badge key={topic} variant="info" className="text-sm px-3 py-1">
              {topic}
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="Topic Distribution">
        {analysis.topicDistribution.some((t) => t.count > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysis.topicDistribution.filter((t) => t.count > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center py-12">No data available yet</p>
        )}
      </Card>

      <Card title="Suggested Practice Schedule">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {analysis.practiceSchedule.map((day) => (
            <div key={day.day} className="rounded-lg border border-slate-700 bg-surface/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-secondary" />
                <span className="font-medium text-white">{day.day}</span>
              </div>
              <p className="text-sm text-secondary mb-1">Focus: {day.focus}</p>
              <p className="text-sm text-muted">{day.problems} problems</p>
              <p className="text-xs text-muted mt-1">Review: {day.review}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
