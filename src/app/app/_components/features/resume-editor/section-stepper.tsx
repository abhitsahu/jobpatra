'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/app/app/_util/cn';
import { HorizontalScrollTabs } from '@/app/app/_components/common/horizontal-scroll-tabs';

const SECTIONS = [
  { key: 'personalInfo', label: 'Personal Info' },
  { key: 'summary', label: 'Summary' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'languages', label: 'Languages' },
  { key: 'references', label: 'References' },
];

interface SectionStepperProps {
  active: string;
  onChange: (key: string) => void;
}

export function SectionStepper({ active, onChange }: SectionStepperProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Scroll the active tab into view whenever it changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [active]);

  return (
    <HorizontalScrollTabs className="border-b border-glass-border" scrollClassName="space-x-1 pb-2">
      {SECTIONS.map((s) => (
        <button
          key={s.key}
          id={`stepper-${s.key}`}
          role="tab"
          aria-selected={active === s.key}
          ref={active === s.key ? activeRef : null}
          onClick={() => onChange(s.key)}
          onKeyDown={(e) => {
            // Arrow key navigation between tabs
            const idx = SECTIONS.findIndex((x) => x.key === s.key);
            if (e.key === 'ArrowRight') {
              const next = SECTIONS[idx + 1];
              if (next) onChange(next.key);
            } else if (e.key === 'ArrowLeft') {
              const prev = SECTIONS[idx - 1];
              if (prev) onChange(prev.key);
            }
          }}
          className={cn(
            'shrink-0 pb-3 px-1 border-b-2 text-[11px] tracking-wider font-semibold uppercase whitespace-nowrap transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/60 focus-visible:rounded-sm',
            active === s.key
              ? 'border-electric-blue text-electric-blue'
              : 'border-transparent text-on-surface-variant hover:text-on-surface',
          )}
        >
          {s.label}
        </button>
      ))}
    </HorizontalScrollTabs>
  );
}
