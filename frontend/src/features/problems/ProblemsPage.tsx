import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, ExternalLink, Code2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TOPICS, DIFFICULTIES, type SolvedProblem } from '@/types';
import { formatTopic, getDifficultyColor, getApiErrorMessage } from '@/lib/utils';

interface ProblemForm {
  title: string;
  difficulty: string;
  topic: string;
  leetcodeUrl: string;
  notes: string;
}

const emptyForm: ProblemForm = {
  title: '',
  difficulty: 'EASY',
  topic: 'ARRAYS',
  leetcodeUrl: '',
  notes: '',
};

export function ProblemsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProblemForm>(emptyForm);
  const [error, setError] = useState('');

  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems', search, topicFilter, difficultyFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (topicFilter) params.set('topic', topicFilter);
      if (difficultyFilter) params.set('difficulty', difficultyFilter);
      const res = await api.get<SolvedProblem[]>(`/problems?${params}`);
      return res.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProblemForm) => {
      if (editingId) {
        const res = await api.put(`/problems/${editingId}`, data);
        return res.data;
      }
      const res = await api.post('/problems', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      closeModal();
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/problems/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p: SolvedProblem) => {
    setEditingId(p.id);
    setForm({
      title: p.problem.title,
      difficulty: p.problem.difficulty,
      topic: p.problem.topic,
      leetcodeUrl: p.problem.leetcodeUrl || '',
      notes: p.notes || '',
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Problem Tracker</h1>
          <p className="text-muted mt-1">Track your solved LeetCode problems</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </div>

      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-lg border border-slate-600 bg-surface pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-secondary focus:outline-none"
            />
          </div>
          <Select
            options={[{ value: '', label: 'All Topics' }, ...TOPICS.map((t) => ({ value: t.value, label: t.label }))]}
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
          />
          <Select
            options={[
              { value: '', label: 'All Difficulties' },
              ...DIFFICULTIES.map((d) => ({ value: d.value, label: d.label })),
            ]}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <Spinner />
      ) : !problems?.length ? (
        <EmptyState
          icon={Code2}
          title="No problems yet"
          description="Start tracking your solved LeetCode problems to build your portfolio."
          action={
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Add Your First Problem
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {problems.map((p) => (
            <Card key={p.id} className="!p-4 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{p.problem.title}</h3>
                    <Badge className={getDifficultyColor(p.problem.difficulty)}>
                      {p.problem.difficulty.charAt(0) + p.problem.difficulty.slice(1).toLowerCase()}
                    </Badge>
                    <Badge variant="info">{formatTopic(p.problem.topic)}</Badge>
                  </div>
                  {p.notes && <p className="text-sm text-muted mt-2 line-clamp-2">{p.notes}</p>}
                  <p className="text-xs text-muted mt-2">
                    Solved {new Date(p.solvedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {p.problem.leetcodeUrl && (
                    <a
                      href={p.problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted hover:text-secondary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 text-muted hover:text-white transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(p.id)}
                    className="p-2 text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Problem' : 'Add Solved Problem'}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
          className="space-y-4"
        >
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <Input
            label="Problem Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Two Sum"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              options={DIFFICULTIES.map((d) => ({ value: d.value, label: d.label }))}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            />
            <Select
              label="Topic"
              options={TOPICS.map((t) => ({ value: t.value, label: t.label }))}
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>
          <Input
            label="LeetCode URL"
            value={form.leetcodeUrl}
            onChange={(e) => setForm({ ...form, leetcodeUrl: e.target.value })}
            placeholder="https://leetcode.com/problems/..."
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-slate-600 bg-surface px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-secondary focus:outline-none resize-none"
              placeholder="Solution approach, time complexity..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saveMutation.isPending}>
              {editingId ? 'Update' : 'Add Problem'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
