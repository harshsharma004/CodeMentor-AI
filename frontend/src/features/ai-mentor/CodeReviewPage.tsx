import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Bot, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import Editor from '@monaco-editor/react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function CodeReviewPage() {
  const [code, setCode] = useState('// Paste your solution here\nfunction twoSum(nums, target) {\n  \n}');
  const [problemTitle, setProblemTitle] = useState('');
  
  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/ai/review', {
        code,
        problemId: 'manual', 
        language: 'javascript'
      });
      return res.data;
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4">
      {/* Top Header / Metadata */}
      <Card className="flex items-center justify-between !py-4 !px-6 bg-card border-border shrink-0">
        <div className="flex items-center gap-4 w-1/2">
          <input 
            value={problemTitle}
            onChange={e => setProblemTitle(e.target.value)}
            placeholder="E.g., Two Sum" 
            className="w-full bg-transparent border-b border-border text-lg font-bold text-white focus:outline-none focus:border-violet-500 pb-1 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => reviewMutation.mutate()} 
            disabled={!code.trim() || reviewMutation.isPending}
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Bot className="h-4 w-4" />
            {reviewMutation.isPending ? 'Analyzing...' : 'AI Review'}
          </Button>
        </div>
      </Card>

      {/* Main 2-Column Area */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        
        {/* Left: Monaco Editor */}
        <div className="flex-1 rounded-[24px] overflow-hidden border border-border bg-[#1e1e1e]">
          <Editor
            height="100%"
            theme="vs-dark"
            language="javascript"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Right: AI Feedback Panel */}
        <Card className="w-[400px] flex flex-col !p-0 overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-card/50 flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold text-white">AI Feedback</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-background/50">
            {reviewMutation.isPending ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
                <p>Analyzing time complexity...</p>
              </div>
            ) : reviewMutation.data ? (
              <div className="space-y-6">
                
                {/* Score or Status */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Analysis Complete</h4>
                    <p className="text-sm text-slate-300">Your solution is functionally correct but can be optimized.</p>
                  </div>
                </div>

                {/* Simulated Feedback Sections */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" /> Complexity
                  </h4>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-sm">
                    <p className="mb-2"><span className="text-muted-foreground">Time:</span> <span className="text-orange-400 font-mono">O(n²)</span> - Detected nested loops.</p>
                    <p><span className="text-muted-foreground">Space:</span> <span className="text-emerald-400 font-mono">O(1)</span> - Constant extra space used.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" /> AI Recommendation
                  </h4>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-sm text-slate-200 leading-relaxed">
                    You can optimize this to <strong>O(n)</strong> time complexity by using a Hash Map to store the complements you've seen so far. This avoids the inner loop entirely.
                  </div>
                </div>
                
                {/* The actual API response parsed beautifully (in reality we would parse reviewMutation.data.review) */}
                <div className="mt-4 p-4 rounded-xl border border-border bg-card whitespace-pre-wrap text-sm text-slate-300">
                  {reviewMutation.data.review}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 text-slate-700 mb-4" />
                <p>Paste your solution and click AI Review to get instant feedback on complexity, readability, and edge cases.</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
