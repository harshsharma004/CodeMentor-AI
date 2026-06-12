import { Link } from 'react-router';
import {
  Zap,
  Code2,
  Bot,
  BarChart3,
  BookOpen,
  Mic,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  { icon: Code2, title: 'Problem Tracker', description: 'Track solved LeetCode problems with topics and difficulty' },
  { icon: Bot, title: 'AI Mentor', description: 'Get hints, explanations, and optimized approaches' },
  { icon: BarChart3, title: 'Weakness Analyzer', description: 'Identify weak topics and get personalized recommendations' },
  { icon: BookOpen, title: 'Study Plans', description: 'AI-generated roadmaps tailored to your target company' },
  { icon: Mic, title: 'Mock Interviews', description: 'Practice DSA, system design, and behavioral questions' },
];

const benefits = [
  'Track coding practice progress',
  'Analyze weak and strong topics',
  'AI-generated hints and explanations',
  'Personalized study plans',
  'Mock interview practice with scoring',
  'Leaderboard and contest tracking',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <nav className="border-b border-slate-700/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20">
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-xl font-bold text-white">CodeMentor AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Master Coding Interviews
          <br />
          <span className="text-secondary">with AI</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
          Track your LeetCode progress, get personalized AI mentorship, and prepare for top tech companies — all in one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg">
              Start Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything you need to succeed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-700/50 bg-surface/30 p-6 hover:border-secondary/30 transition-colors"
            >
              <div className="rounded-lg bg-secondary/10 w-fit p-3 mb-4">
                <Icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-surface/50 to-secondary/5 p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why CodeMentor AI?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-6xl font-bold text-secondary mb-2">10+</p>
              <p className="text-muted mb-6">Topic categories tracked</p>
              <p className="text-6xl font-bold text-accent mb-2">AI</p>
              <p className="text-muted">Powered mentorship</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-700/50 py-8 text-center text-muted text-sm">
        © 2026 CodeMentor AI. Built for aspiring software engineers.
      </footer>
    </div>
  );
}
