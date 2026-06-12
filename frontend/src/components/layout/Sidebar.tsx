import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Code2,
  Bot,
  BookOpen,
  BarChart3,
  Mic,
  User,
  Trophy,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/problems', icon: Code2, label: 'Problems' },
  { to: '/ai-mentor', icon: Bot, label: 'AI Mentor' },
  { to: '/study-plan', icon: BookOpen, label: 'Study Plan' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/mock-interview', icon: Mic, label: 'Mock Interview' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-700/50 bg-primary/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20">
          <Zap className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">CodeMentor</h1>
          <p className="text-xs text-muted">AI Interview Mentor</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-secondary/10 text-secondary border border-secondary/20'
                  : 'text-slate-400 hover:bg-surface hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
