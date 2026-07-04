'use client';

import { SheetCard, WaxSeal } from './settings-primitives';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  percent: number;
}

function ProgressBar({ label, current, max, percent }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span
          className="text-[14px] font-semibold text-[#2b1611]"
          style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          {label}
        </span>
        <span
          className="text-[14px] font-semibold text-[#2b1611]"
          style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          {current} / {max}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#ffdad2' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, background: '#795900' }}
        />
      </div>
    </div>
  );
}

export function SubscriptionSection() {
  return (
    <SheetCard id="subscription" className="relative">
      <div className="absolute top-6 right-6">
        <WaxSeal />
      </div>

      <h3
        className="text-[24px] leading-[32px] font-semibold text-[#5b060c] mb-8"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Premium Workshop
      </h3>

      <div className="grid grid-cols-2 gap-10">
        {/* Left: plan info + usage */}
        <div>
          <div className="mb-6">
            <p
              className="text-[10px] font-semibold text-[#564240] uppercase tracking-widest mb-1"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Current Plan
            </p>
            <p
              className="text-[24px] leading-[32px] font-semibold text-[#795900]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Professional Pro
            </p>
          </div>
          <div className="space-y-4">
            <ProgressBar label="Resume Drafts" current={6} max={15} percent={40} />
            <ProgressBar label="AI Optimization Credits" current={850} max={1000} percent={85} />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col justify-center space-y-4">
          <button
            className="w-full py-3 rounded-lg text-[14px] font-bold tracking-wide"
            style={{
              background: '#f6be39',
              color: '#261a00',
              fontFamily: 'Hanken Grotesk, sans-serif',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.1)',
            }}
            onClick={() => alert('Manage billing (placeholder)')}
          >
            Manage Billing
          </button>
          <button
            className="w-full py-3 border-2 border-[#ddc0bd] text-[#564240] rounded-lg text-[14px] font-semibold hover:bg-[#ffe9e4] transition-colors"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            onClick={() => alert('Upgrade plan (placeholder)')}
          >
            Upgrade Plan
          </button>
          <p
            className="text-[10px] text-center text-[#564240] italic"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            Next billing cycle: Dec 24, 2024
          </p>
        </div>
      </div>
    </SheetCard>
  );
}
