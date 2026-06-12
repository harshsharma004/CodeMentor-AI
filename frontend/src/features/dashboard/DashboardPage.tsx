import { useQuery } from '@tanstack/react-query';
import { Code2, Flame, Trophy, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { DashboardStats } from '@/types';

const COLORS = ['#22C55E', '#EAB308', '#EF4444'];
const PIE_COLORS = ['#3B82F6', '#22C55E', '#EAB308', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get<DashboardStats>('/analytics/dashboard');
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;
  if (!stats) return null;

  const statCards = [
    { label: 'Problems Solved', value: stats.totalSolved, icon: Code2, color: 'text-secondary' },
    { label: 'Current Streak', value: `${stats.streak} days`, icon: Flame, color: 'text-orange-400' },
    { label: 'Contest Rating', value: stats.contestRating ?? 'N/A', icon: Trophy, color: 'text-yellow-400' },
    { label: 'This Week', value: stats.weeklyProgress[3]?.count ?? 0, icon: TrendingUp, color: 'text-accent' },
  ];

  const difficultyData = [
    { name: 'Easy', value: stats.easy },
    { name: 'Medium', value: stats.medium },
    { name: 'Hard', value: stats.hard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-muted mt-1">Track your coding progress at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="!p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`rounded-lg bg-surface p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="!p-3">
          <p className="text-sm font-medium text-accent mb-1">Easy</p>
          <p className="text-3xl font-bold text-white">{stats.easy}</p>
        </Card>
        <Card className="!p-3">
          <p className="text-sm font-medium text-yellow-400 mb-1">Medium</p>
          <p className="text-3xl font-bold text-white">{stats.medium}</p>
        </Card>
        <Card className="!p-3">
          <p className="text-sm font-medium text-red-400 mb-1">Hard</p>
          <p className="text-3xl font-bold text-white">{stats.hard}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Problems Solved Trend">
          {stats.solvedTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.solvedTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-12">No data yet. Start solving problems!</p>
          )}
        </Card>

        <Card title="Weekly Progress">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
              <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Topic Distribution">
          {stats.topicDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.topicDistribution}
                  dataKey="count"
                  nameKey="topic"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ topic, count }) => `${topic}: ${count}`}
                >
                  {stats.topicDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-center py-12">No topics tracked yet</p>
          )}
        </Card>

        <Card title="Difficulty Breakdown">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={difficultyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {difficultyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
