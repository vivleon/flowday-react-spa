'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useNotice } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const iconByTone = {
  success: <CircleCheck className="size-4" />,
  error: <CircleAlert className="size-4" />,
  info: <Info className="size-4" />,
};

export function NotificationCenter() {
  const { notices, dismissNotice } = useNotice();
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-50 flex w-[min(360px,calc(100%-32px))] flex-col gap-3">
      <AnimatePresence>
        {notices.map((notice) => (
          <motion.div
            key={notice.id}
            initial={reducedMotion ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.16 }}
            className="pointer-events-auto glass-panel rounded-3xl border-none p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-secondary p-2">
                {iconByTone[notice.tone]}
              </div>
              <div className="flex-1" role={notice.tone === 'error' ? 'alert' : 'status'}>
                <p className="font-medium">{notice.title}</p>
                {notice.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notice.description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => dismissNotice(notice.id)}
                aria-label="알림 닫기"
              >
                <X className="size-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
