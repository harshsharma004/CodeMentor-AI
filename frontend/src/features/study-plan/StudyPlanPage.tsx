import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { StudyPlan } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

const SKILL_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Study Plan Generator</h1>
        <p className="text-muted mt-1">AI-powered personalized interview preparation roadmap</p>
      </div>

      <Card title="Generate New Plan">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateMutation.mutate();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Skill Level"
              options={SKILL_LEVELS}
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            />
            <Input
              label="Target Company"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="Google, Meta, Amazon..."
              required
            />
            <Input
              label="Hours Per Week"
              type="number"
              min={1}
              max={80}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              required
            />
          </div>
          <Button type="submit" loading={generateMutation.isPending}>
            <Sparkles className="h-4 w-4" />
            Generate Study Plan
          </Button>
        </form>
      </Card>

      {isLoading ? (
        <Spinner />
      ) : !plans?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No study plans yet"
          description="Generate your first AI-powered study plan to start preparing for interviews."
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Study Plans</h2>
          {plans.map((plan) => (
            <Card key={plan.id}>
              <button
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <h3 className="font-semibold text-white">{plan.title}</h3>
                  <p className="text-sm text-muted mt-1">{plan.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{plan.skillLevel}</Badge>
                    {plan.targetCompany && <Badge>{plan.targetCompany}</Badge>}
                    <Badge>{plan.hoursPerWeek}h/week</Badge>
                  </div>
                </div>
                {expandedPlan === plan.id ? (
                  <ChevronUp className="h-5 w-5 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted shrink-0" />
                )}
              </button>

              {expandedPlan === plan.id && plan.roadmap && (
                <div className="mt-6 space-y-4 border-t border-slate-700 pt-4">
                  <p className="text-sm text-muted">
                    Timeline: <span className="text-white">{plan.roadmap.timeline}</span>
                  </p>

                  {plan.roadmap.weeks?.map((week) => (
                    <div key={week.week} className="rounded-lg bg-surface/50 p-4">
                      <h4 className="font-medium text-white mb-2">Week {week.week}</h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {week.topics.map((t) => (
                          <Badge key={t} variant="success">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <ul className="space-y-1 mb-3">
                        {week.problems.map((p) => (
                          <li key={p.title} className="text-sm text-slate-300">
                            • {p.title}{' '}
                            <span className="text-muted">({p.difficulty})</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm text-muted">
                        Goals: {week.goals.join(', ')}
                      </div>
                    </div>
                  ))}

                  {plan.roadmap.tips && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Tips</h4>
                      <ul className="space-y-1">
                        {plan.roadmap.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-slate-300">
                            • {tip}
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
