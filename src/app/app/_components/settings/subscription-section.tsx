import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubscriptionStatusClient } from '@/app/api/client/payments/payments-client';
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
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchStatus() {
      try {
        const res = await getSubscriptionStatusClient();
        if (res.success && active) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching subscription status:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchStatus();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <SheetCard id="subscription" className="relative animate-pulse">
        <h3
          className="text-[24px] leading-[32px] font-semibold text-[#5b060c] mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Premium Workshop
        </h3>
        <div className="h-40 bg-[#ddc0bd]/20 rounded-lg"></div>
      </SheetCard>
    );
  }

  const sub = data?.subscription;
  const usage = data?.usage;

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
              {sub?.planName || 'Free Lifetime'}
            </p>
          </div>
          <div className="space-y-4">
            <ProgressBar
              label="Resume Drafts"
              current={usage?.resumes?.current ?? 0}
              max={usage?.resumes?.max ?? 3}
              percent={usage?.resumes?.percent ?? 0}
            />
            <ProgressBar
              label="AI Optimization Credits"
              current={usage?.aiOptimizations?.current ?? 0}
              max={usage?.aiOptimizations?.max ?? 1}
              percent={usage?.aiOptimizations?.percent ?? 0}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col justify-center space-y-4">
          {sub?.plan !== 'FREE' ? (
            <button
              className="w-full py-3 rounded-lg text-[14px] font-bold tracking-wide cursor-pointer hover:brightness-110 transition-all"
              style={{
                background: '#f6be39',
                color: '#261a00',
                fontFamily: 'Hanken Grotesk, sans-serif',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.1)',
              }}
              onClick={() =>
                alert(
                  `For billing questions, updates, or to cancel your subscription, please contact support at billing@jobpatra.com.`
                )
              }
            >
              Manage Billing
            </button>
          ) : (
            <div className="text-[12px] text-center text-[#564240] font-semibold">
              Upgrade to unleash full premium features
            </div>
          )}
          <button
            className="w-full py-3 border-2 border-[#ddc0bd] text-[#564240] rounded-lg text-[14px] font-semibold hover:bg-[#ffe9e4] transition-colors cursor-pointer"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            onClick={() => router.push('/pricing')}
          >
            Upgrade Plan
          </button>
          {sub?.currentPeriodEnd && (
            <p
              className="text-[10px] text-center text-[#564240] italic"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Next billing cycle:{' '}
              {new Date(sub.currentPeriodEnd).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </SheetCard>
  );
}
