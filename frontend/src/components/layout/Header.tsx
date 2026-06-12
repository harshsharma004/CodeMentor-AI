import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, Moon, Sun, LogOut, User, ChevronDown, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useLogout } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const { darkMode, toggleDarkMode } = useThemeStore();
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-700/50 bg-primary/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <Zap className="h-5 w-5 text-secondary" />
          <span className="font-bold text-white">CodeMentor</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-slate-400 hover:bg-surface hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-slate-300">{user?.name}</span>
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-700 bg-surface shadow-xl py-1">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout.mutate();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
