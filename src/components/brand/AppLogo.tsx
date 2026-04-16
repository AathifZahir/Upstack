import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: 'h-6 w-6', icon: 'h-3.5 w-3.5', text: 'text-sm' },
  md: { box: 'h-7 w-7', icon: 'h-4 w-4', text: 'text-base' },
  lg: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-xl' },
};

export function AppLogo({ size = 'md', variant = 'dark', showText = true, className }: AppLogoProps) {
  const s = sizeMap[size];
  const isDark = variant === 'dark';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-[8px]',
        s.box,
        isDark ? 'bg-accent' : 'bg-foreground',
      )}>
        <span className="relative inline-flex h-full w-full items-center justify-center">
          <ChevronUp
            className={cn(s.icon, 'absolute -translate-y-[18%] text-primary-foreground')}
            strokeWidth={3}
          />
          <ChevronUp
            className={cn(s.icon, 'absolute translate-y-[18%] text-primary-foreground')}
            strokeWidth={3}
          />
        </span>
      </div>
      {showText && (
        <span className={cn(
          'font-bold tracking-[-0.02em]',
          s.text,
          isDark ? 'text-primary-foreground' : 'text-foreground',
        )}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
