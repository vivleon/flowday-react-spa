import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
