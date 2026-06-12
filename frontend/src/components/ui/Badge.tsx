import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-accent/10 text-accent border border-accent/20',
    warning: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
    danger: 'bg-red-400/10 text-red-400 border border-red-400/20',
    info: 'bg-secondary/10 text-secondary border border-secondary/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
