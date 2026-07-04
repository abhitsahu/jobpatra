'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePricing } from '@/app/app/_hooks/use-pricing';
import { BillingToggle } from '../../_components/pricing/billing-toggle';
import { PricingGrid } from '../../_components/pricing/pricing-grid';
import { ComparisonTable } from '../../_components/pricing/comparison-table';
import { TestimonialSection } from '../../_components/pricing/testimonial-section';

export function PricingClient() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const { data, isLoading, isError } = usePricing();

  const handleSelectPlan = (slug: string) => {
    router.push(`/app/signup?plan=${slug}&interval=${isYearly ? 'yearly' : 'monthly'}`);
  };

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto animate-pulse">
        {/* Hero Header Skeleton */}
        <header className="text-center mb-16">
          <div className="h-12 w-80 bg-[#ddc0bd]/20 rounded mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-[#ddc0bd]/20 rounded mx-auto"></div>
          <div className="h-10 w-48 bg-[#ddc0bd]/20 rounded-full mx-auto mt-12"></div>
        </header>

        {/* Pricing Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="sheet-bg border border-[#ddc0bd]/30 p-8 rounded-lg h-96 flex flex-col justify-between"
            >
              <div>
                <div className="h-6 w-24 bg-[#ddc0bd]/20 rounded mb-4"></div>
                <div className="h-10 w-32 bg-[#ddc0bd]/20 rounded mb-6"></div>
                <div className="h-4 w-full bg-[#ddc0bd]/20 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-[#ddc0bd]/20 rounded"></div>
              </div>
              <div className="h-10 w-full bg-[#ddc0bd]/20 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto text-center">
        <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] text-[#5b060c] mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-[#564240] mb-8 font-['Hanken_Grotesk']">
          We could not load the pricing plans right now. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#5b060c] text-white font-semibold rounded-lg hover:brightness-110"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="text-center mb-16">
        <h1 className="font-['Playfair_Display'] text-[48px] leading-[56px] font-bold mb-4 text-[#5b060c]">
          Invest in Your Future
        </h1>
        <p className="text-[#564240] max-w-2xl mx-auto font-['Hanken_Grotesk'] text-[18px] leading-[28px]">
          Select the toolset that fits your career stage. From early exploration to executive
          excellence.
        </p>
        {/* Billing Toggle */}
        <BillingToggle
          isYearly={isYearly}
          onToggle={() => setIsYearly(!isYearly)}
          discountPercentage={data.globalDiscount}
        />
      </header>

      {/* Pricing Cards Grid */}
      <PricingGrid plans={data.plans} isYearly={isYearly} onSelectPlan={handleSelectPlan} />

      {/* Detailed Feature Ledger */}
      <ComparisonTable plans={data.plans} comparison={data.comparison} />

      {/* Testimonial / Trust Section */}
      <TestimonialSection testimonials={data.testimonials} />
    </main>
  );
}
