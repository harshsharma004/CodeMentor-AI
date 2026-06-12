import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mic, Play, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import type { MockInterview } from '@/types';
import { getApiErrorMessage } from '@/lib/utils';

const INTERVIEW_TYPES = [
  { value: 'DSA', label: 'DSA', description: 'Data Structures & Algorithms' },
  { value: 'SYSTEM_DESIGN', label: 'System Design', description: 'Architecture & Scalability' },
  { value: 'BEHAVIORAL', label: 'Behavioral', description: 'STAR Method Questions' },
];

export function MockInterviewPage() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState('DSA');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<MockInterview | null>(null);
  const [error, setError] = useState('');

  const { data: history, isLoading } = useQuery({
    queryKey: ['mock-interviews'],
    queryFn: async () => {
      const res = await api.get<MockInterview[]>('/ai/mock-interviews');
      return res.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (type: string) => {
      const res = await api.post<{ question: string }>('/ai/mock-interview/question', { type });
      return res.data;
    },
    onSuccess: (data) => {
      setQuestion(data.question);
      setAnswer('');
      setResult(null);
      setError('');
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const evaluateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post<MockInterview>('/ai/mock-interview/evaluate', {
        type: selectedType,
        question,
        answer,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['mock-interviews'] });
      setError('');
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mock Interview</h1>
        <p className="text-muted mt-1">Practice interviews with AI evaluation and feedback</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INTERVIEW_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setSelectedType(type.value);
              setQuestion('');
              setAnswer('');
              setResult(null);
            }}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedType === type.value
                ? 'border-secondary bg-secondary/10'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <Mic className={`h-5 w-5 mb-2 ${selectedType === type.value ? 'text-secondary' : 'text-muted'}`} />
            <h3 className="font-semibold text-white">{type.label}</h3>
            <p className="text-sm text-muted mt-1">{type.description}</p>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Card>
        {!question ? (
          <div className="text-center py-8">
            <p className="text-muted mb-4">Ready to practice? Generate a question to get started.</p>
            <Button onClick={() => generateMutation.mutate(selectedType)} loading={generateMutation.isPending}>
              <Play className="h-4 w-4" />
              Generate Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Badge variant="info" className="mb-2">
                {selectedType.replace('_', ' ')}
              </Badge>
              <h3 className="text-lg font-semibold text-white">Question</h3>
              <p className="text-slate-300 mt-2 whitespace-pre-wrap">{question}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-600 bg-surface px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-secondary focus:outline-none resize-none"
                placeholder="Type your answer here..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => evaluateMutation.mutate()}
                disabled={!answer.trim()}
                loading={evaluateMutation.isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Submit Answer
              </Button>
              <Button
                variant="secondary"
                onClick={() => generateMutation.mutate(selectedType)}
                loading={generateMutation.isPending}
              >
                New Question
              </Button>
            </div>
          </div>
        )}
      </Card>

      {result && result.feedback && (
        <Card title={`Score: ${result.score}/100`}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-surface/50 p-4">
                <p className="text-sm text-muted mb-1">Correctness</p>
                <p className="text-sm text-white">{result.feedback.correctness}</p>
              </div>
              <div className="rounded-lg bg-surface/50 p-4">
                <p className="text-sm text-muted mb-1">Communication</p>
                <p className="text-sm text-white">{result.feedback.communication}</p>
              </div>
              <div className="rounded-lg bg-surface/50 p-4">
                <p className="text-sm text-muted mb-1">Optimization</p>
                <p className="text-sm text-white">{result.feedback.optimization}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-accent mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {result.feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-300">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Improvements</h4>
                <ul className="space-y-1">
                  {result.feedback.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-slate-300">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-sm text-slate-300 border-t border-slate-700 pt-4">
              {result.feedback.overall}
            </p>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Spinner />
      ) : history && history.length > 0 ? (
        <Card title="Recent Interviews">
          <div className="space-y-3">
            {history.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between rounded-lg bg-surface/50 p-3"
              >
                <div>
                  <Badge variant="info" className="mb-1">
                    {interview.type.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-slate-300 line-clamp-1">{interview.question}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-bold text-white">{interview.score}/100</p>
                  <p className="text-xs text-muted">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
