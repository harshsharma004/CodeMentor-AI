import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({ className, title, description, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700/50 bg-surface/50 backdrop-blur-sm p-6',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="text-sm text-muted mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
