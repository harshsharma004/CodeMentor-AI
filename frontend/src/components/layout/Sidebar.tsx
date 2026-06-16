import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Code2,
  Bot,
  BookOpen,
  BarChart3,
  User,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/problems', icon: Code2, label: 'Problems' },
  { to: '/code-review', icon: Bot, label: 'Code Review' },
  { to: '/study-plan', icon: BookOpen, label: 'Study Plan' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center gap-3 px-6 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20">
          <Zap className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">CodeMentor AI</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
