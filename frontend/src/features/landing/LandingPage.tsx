import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Code2,
  Bot,
  BarChart3,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  Crosshair,
  CheckCircle2
} from 'lucide-react';

const connectedFeatures = [
  { id: 1, label: 'AI Code Review', icon: Bot, x: -280, y: -120, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', delay: 0.1 },
  { id: 2, label: 'Topic Mastery', icon: BarChart3, x: 280, y: -80, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', delay: 0.2 },
  { id: 3, label: 'Readiness Score', icon: TrendingUp, x: 180, y: 160, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', delay: 0.3 },
  { id: 4, label: 'Weakness Detection', icon: Brain, x: -160, y: 140, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', delay: 0.4 },
  { id: 5, label: 'Daily Challenge', icon: Code2, x: 340, y: 40, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', delay: 0.5 },
  { id: 6, label: 'Personalized Roadmaps', icon: BookOpen, x: -320, y: 20, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', delay: 0.6 },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Floating Pill Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <Crosshair className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">CodeMentor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#product" className="hover:text-black transition-colors">Product</a>
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-black transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 rounded-full bg-black text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-md">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        
        {/* Connected Node Visualization */}
        <div className="relative w-full max-w-4xl h-[400px] mb-12 hidden md:flex items-center justify-center">
          
          {/* Central Hub */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="absolute z-20 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/30"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>

          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
            <g transform="translate(448, 200)"> {/* Center of the 896x400 container roughly */}
              {connectedFeatures.map((f) => (
                <motion.line
                  key={`line-${f.id}`}
                  x1="0"
                  y1="0"
                  x2={f.x}
                  y2={f.y}
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: f.delay }}
                />
              ))}
            </g>
          </svg>

          {/* Floating Nodes */}
          {connectedFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.id}
                className="absolute z-10"
                style={{
                  x: f.x,
                  y: f.y,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: f.delay, type: 'spring' }}
              >
                <div className={`flex flex-col items-center gap-2`}>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white border ${f.border} shadow-xl shadow-slate-200/50`}>
                    <div className={`p-2.5 rounded-xl ${f.bg}`}>
                      <Icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    {f.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Central Hub (Fallback) */}
        <div className="md:hidden mb-12 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>

        {/* Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
            The all-in-one <br className="hidden md:block" />
            interview platform.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            CodeMentor is a modern, AI-powered preparation platform designed to perfectly fit your interview timeline and expose your weaknesses.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF5A36] text-white font-bold text-base hover:bg-[#E04828] transition-all shadow-lg shadow-orange-500/20 group">
                Request a Demo <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 font-bold text-base hover:bg-slate-50 transition-all shadow-sm">
                View Dashboard
              </button>
            </Link>
          </div>
        </motion.div>

      </section>
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
