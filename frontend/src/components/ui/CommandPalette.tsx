import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router';
import { 
  Code2, 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  BarChart3, 
  User, 
  Search,
  Command as CmdIcon
} from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm">
      {/* Overlay to close on click outside */}
      <div className="absolute inset-0" onClick={() => setOpen(false)} />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <Command
          className="flex h-full w-full flex-col"
          shouldFilter={true}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || (e.key === 'Backspace' && !(e.target as HTMLInputElement).value)) {
              e.preventDefault();
              setOpen(false);
            }
          }}
        >
          <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              <Command.Item 
                onSelect={() => { navigate('/dashboard'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/problems'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <Code2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Problems</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/ai-mentor'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <Bot className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>AI Mentor</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/study-plan'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Study Plan</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/analytics'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Analytics</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => { navigate('/profile'); setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Separator className="-mx-1 h-px bg-border my-1" />
            
            <Command.Group heading="Quick Actions" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              <Command.Item 
                onSelect={() => { setOpen(false); }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <CmdIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Connect LeetCode Account...</span>
              </Command.Item>
            </Command.Group>

          </Command.List>
        </Command>
      </div>
    </div>
  );
}
