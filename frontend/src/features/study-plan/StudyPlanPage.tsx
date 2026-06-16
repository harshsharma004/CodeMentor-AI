import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, ChevronDown, ChevronUp, Waypoints, Target, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { StudyPlan } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

const SKILL_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-800/50 rounded-md ${className}`} />;
}

export function StudyPlanPage() {
  const queryClient = useQueryClient();
  const [skillLevel, setSkillLevel] = useState('INTERMEDIATE');
  const [targetCompany, setTargetCompany] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: plans, isLoading } = useQuery({
    queryKey: ['study-plans'],
    queryFn: async () => {
      const res = await api.get<StudyPlan[]>('/ai/study-plans');
      return res.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post<StudyPlan>('/ai/study-plan', {
        skillLevel,
        targetCompany,
        hoursPerWeek: parseInt(hoursPerWeek, 10),
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['study-plans'] });
      setExpandedPlan(data.id);
      setError('');
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <Waypoints className="h-8 w-8 text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Adaptive Roadmaps</h1>
          <p className="text-muted-foreground mt-1">AI-generated personalized interview preparation timelines.</p>
        </div>
      </div>

      <Card spotlight className="border-border">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Generate New Roadmap</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateMutation.mutate();
          }}
          className="space-y-6"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Current Skill Level"
              options={SKILL_LEVELS}
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            />
            <Input
              label="Target Company"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Google, Meta..."
              required
            />
            <Input
              label="Available Hours / Week"
              type="number"
              min={1}
              max={80}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={generateMutation.isPending} className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              Generate Timeline
            </Button>
          </div>
        </form>
      </Card>

      {isLoading ? (
        <div className="space-y-4 mt-12">
          <Skeleton className="h-24 w-full rounded-[24px]" />
          <Skeleton className="h-24 w-full rounded-[24px]" />
        </div>
      ) : !plans?.length ? (
        <EmptyState
          icon={Waypoints}
          title="No roadmaps active"
          description="Configure your targets above to generate your first AI timeline."
        />
      ) : (
        <div className="space-y-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Your Active Roadmaps</h2>
          {plans.map((plan) => (
            <Card key={plan.id} spotlight className="p-0 overflow-hidden">
              <button
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" /> {plan.targetCompany || 'General'}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" /> {plan.hoursPerWeek}h/week
                    </div>
                    <Badge variant="info" className="ml-2 bg-indigo-500/10 text-indigo-300 border-indigo-500/20">{plan.skillLevel}</Badge>
                  </div>
                </div>
                {expandedPlan === plan.id ? (
                  <ChevronUp className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                )}
              </button>

              {expandedPlan === plan.id && plan.roadmap && (
                <div className="border-t border-border bg-black/20 p-6">
                  
                  {/* Timeline Render */}
                  <div className="font-mono text-sm leading-relaxed text-slate-300">
                    <div className="text-violet-400 mb-4 font-bold tracking-wider">TIMELINE: {plan.roadmap.timeline}</div>
                    
                    {plan.roadmap.weeks?.map((week) => (
                      <div key={week.week} className="mb-6">
                        <div className="text-white font-bold mb-2">Week {week.week}</div>
                        
                        {/* Topics Tree */}
                        {week.topics.map((topic, i) => {
                          const isLastTopic = i === week.topics.length - 1 && week.problems.length === 0;
                          return (
                            <div key={topic} className="flex">
                              <span className="text-muted-foreground mr-2">{isLastTopic ? '└─' : '├─'}</span>
                              <span className="text-indigo-300">{topic}</span>
                            </div>
                          );
                        })}

                        {/* Problems Tree */}
                        {week.problems.map((p, i) => {
                          const isLastProblem = i === week.problems.length - 1;
                          return (
                            <div key={p.title} className="flex">
                              <span className="text-muted-foreground mr-2">{isLastProblem ? '└─' : '├─'}</span>
                              <span>{p.title} <span className="text-muted-foreground text-xs ml-1">({p.difficulty})</span></span>
                            </div>
                          );
                        })}

                        {/* Goals as leaf node */}
                        {week.goals.length > 0 && (
                          <div className="flex mt-2 text-xs text-muted-foreground/80">
                            <span className="mr-6">│</span>
                            <span>Goals: {week.goals.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tips Section */}
                  {plan.roadmap.tips && plan.roadmap.tips.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <h4 className="font-medium text-white text-sm uppercase tracking-wider">AI Strategy Tips</h4>
                      </div>
                      <ul className="space-y-2">
                        {plan.roadmap.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-violet-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
