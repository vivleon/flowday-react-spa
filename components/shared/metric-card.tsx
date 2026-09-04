import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card className="glass-panel border-none">
      <CardContent className="flex items-start justify-between gap-4 py-1">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3">{icon}</div>
      </CardContent>
    </Card>
  );
}
