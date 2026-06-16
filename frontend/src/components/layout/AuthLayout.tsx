import { Outlet, Link } from 'react-router';
import { Target, TrendingUp, Sparkles, Crosshair } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#050816]">
      {/* Left Side: Brand & Product Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black flex-col justify-between p-16 border-r border-white/5">
        
        {/* Very subtle glow, reduced by 60% as requested */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Crosshair className="h-6 w-6 text-violet-400" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CodeMentor AI</span>
          </Link>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Stop grinding.<br />
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">mastering.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-md font-light leading-relaxed mb-16">
            An elite preparation platform for top tech companies. Generate targeted roadmaps and get instant AI code reviews.
          </p>

          <div className="space-y-8">
             <div className="flex items-start gap-4">
               <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                 <Target className="h-6 w-6 text-indigo-400" />
               </div>
               <div>
                 <h4 className="text-white font-bold tracking-wide">Targeted Preparation</h4>
                 <p className="text-slate-400 text-sm mt-1 max-w-[250px]">Stop solving random problems. Focus on your weakest topics automatically.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                 <Sparkles className="h-6 w-6 text-violet-400" />
               </div>
               <div>
                 <h4 className="text-white font-bold tracking-wide">AI Code Review</h4>
                 <p className="text-slate-400 text-sm mt-1 max-w-[250px]">Get real-time feedback on time and space complexity just like a real interview.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                 <TrendingUp className="h-6 w-6 text-emerald-400" />
               </div>
               <div>
                 <h4 className="text-white font-bold tracking-wide">Readiness Scoring</h4>
                 <p className="text-slate-400 text-sm mt-1 max-w-[250px]">Know exactly when you are ready to interview at Meta, Google, or Amazon.</p>
               </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 CodeMentor AI. All rights reserved.
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 relative">
        {/* Abstract subtle background pattern for right side */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.015\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div 
          className="w-full max-w-[420px] rounded-[24px] p-10 relative z-10 shadow-2xl"
          style={{
            background: 'rgba(11,16,32,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
