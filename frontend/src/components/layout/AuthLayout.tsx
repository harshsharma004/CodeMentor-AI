import { Outlet, Link } from 'react-router';
import { Zap } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-slate-900 to-secondary/20 p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
            <Zap className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-2xl font-bold text-white">CodeMentor AI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Master coding interviews with AI
          </h2>
          <p className="text-lg text-slate-400 max-w-md">
            Track your LeetCode progress, get personalized hints, and prepare for top tech companies with your AI mentor.
          </p>
        </div>
        <p className="text-sm text-muted">© 2026 CodeMentor AI. All rights reserved.</p>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-primary">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
