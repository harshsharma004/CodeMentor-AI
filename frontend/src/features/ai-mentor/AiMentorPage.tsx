import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { ChatMessage } from '@/types';

const SUGGESTIONS = [
  'Explain binary search',
  'Give me a hint for Two Sum',
  'What is dynamic programming?',
  'How do I approach graph problems?',
];

export function AiMentorPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const res = await api.get<ChatMessage[]>('/ai/chat/history');
      return res.data;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await api.post<{ message: string }>('/ai/chat', { message: msg });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
      setMessage('');
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => api.delete('/ai/chat/history'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-history'] }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, chatMutation.isPending]);

  const handleSend = (msg?: string) => {
    const text = msg || message;
    if (!text.trim() || chatMutation.isPending) return;
    chatMutation.mutate(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Mentor</h1>
          <p className="text-muted mt-1">Your personal coding interview assistant</p>
        </div>
        {history && history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => clearMutation.mutate()}>
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden !p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <Spinner />
          ) : !history?.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="rounded-full bg-secondary/10 p-4 mb-4">
                <Bot className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ask me anything!</h3>
              <p className="text-muted max-w-md mb-6">
                Get hints, explanations, and optimized approaches for coding problems.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-secondary hover:text-secondary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {history.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'ASSISTANT' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                      <Bot className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === 'USER'
                        ? 'bg-secondary text-white'
                        : 'bg-surface text-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'USER' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
                      <User className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                    <Bot className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="bg-surface rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:0.1s]" />
                      <span className="h-2 w-2 rounded-full bg-muted animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t border-slate-700 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a coding question..."
              className="flex-1 rounded-lg border border-slate-600 bg-surface px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-secondary focus:outline-none"
              disabled={chatMutation.isPending}
            />
            <Button type="submit" disabled={!message.trim() || chatMutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
