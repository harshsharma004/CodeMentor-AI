import { NavLink } from 'react-router';
import { X, LayoutDashboard, Code2, Bot, BookOpen, BarChart3, Mic, User, Trophy } from 'lucide-react';
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

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-primary border-r border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="font-bold text-white">CodeMentor AI</span>
          <button onClick={onClose} className="p-2 text-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-secondary/10 text-secondary' : 'text-slate-400 hover:text-white'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
