'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePricing } from '@/app/app/_hooks/use-pricing';
import { BillingToggle } from '../../_components/pricing/billing-toggle';
import { PricingGrid } from '../../_components/pricing/pricing-grid';
import { ComparisonTable } from '../../_components/pricing/comparison-table';
import { TestimonialSection } from '../../_components/pricing/testimonial-section';
import { PaymentProcessingOverlay } from '../../_components/pricing/payment-processing-overlay';
import { BillingPeriod } from '@/app/api/model/enums/subscription';
import { createOrderClient, verifyPaymentClient } from '@/app/api/client/payments/payments-client';
import { getSessionClient } from '@/app/api/client/auth/auth-client';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

import { IconMapper } from '@/app/_components/icons/IconMapper';

export function PricingClient() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlanName, setProcessingPlanName] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = usePricing();

  const handleSelectPlan = async (slug: string) => {
    try {
      const session = await getSessionClient();

      if (!session) {
        // Redirect guest user to login page
        router.push(`/app/login?redirect=/app/subscription&plan=${slug}&interval=${isYearly ? 'quarterly' : 'monthly'}`);
        return;
      }

      // Determine active currency
      const activeCurrency = data?.plans?.find((p) => p.slug === slug)?.currency || 'INR';

      // 1. Create order on the server
      const orderRes = await createOrderClient({
        planSlug: slug,
        billingPeriod: isYearly ? BillingPeriod.QUARTERLY : BillingPeriod.MONTHLY,
        currency: activeCurrency as 'INR' | 'USD',
      });

      if (!orderRes.success) {
        alert(orderRes.message || 'Failed to initiate payment.');
        return;
      }

      // 2. Handle immediate activation for free plan
      if (orderRes.isFree) {
        router.push('/app/settings?section=subscription&payment=success');
        router.refresh();
        return;
      }

      // 3. Dynamically load Razorpay Checkout script if not loaded
      if (!(window as any).Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert('Failed to load payment gateway script. Please check your internet connection.');
          return;
        }
      }

      // 4. Open Razorpay Checkout modal
      const options = {
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'JobPatra',
        description: `Upgrade to ${slug.toUpperCase()} Plan`,
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          try {
            // Show full-screen processing overlay immediately — do not let user navigate away
            const selectedPlan = data?.plans?.find((p) => p.slug === slug);
            setProcessingPlanName(selectedPlan?.name);
            setIsProcessing(true);

            const verifyRes = await verifyPaymentClient({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planSlug: slug,
              billingPeriod: isYearly ? BillingPeriod.QUARTERLY : BillingPeriod.MONTHLY,
            });

            if (verifyRes.success) {
              // Redirect to subscription settings with success flag
              router.push('/app/settings?section=subscription&payment=success');
              router.refresh();
            } else {
              setIsProcessing(false);
              alert(verifyRes.message || 'Signature verification failed. Please contact support.');
            }
          } catch (err: any) {
            setIsProcessing(false);
            console.error('Payment verification failed:', err);
            alert(err.message || 'An error occurred during payment verification.');
          } finally {
          }
        },
        prefill: {
          name: orderRes.customer?.name || '',
          email: orderRes.customer?.email || '',
        },
        theme: {
          color: '#5b060c',
        },
        modal: {
          ondismiss: function () {
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout failed:', err);
      alert(err.message || 'An error occurred during checkout initialization.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#2b1611] font-['Hanken_Grotesk']">
        <main className="pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto animate-pulse">
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
                className="bg-[#FFF8F6] border border-[#E5D9C8] p-8 rounded-2xl h-96 flex flex-col justify-between"
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
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#2b1611] font-['Hanken_Grotesk']">
        <main className="pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] text-[#370003] mb-4 font-bold">
            Oops! Something went wrong.
          </h2>
          <p className="text-[#564240] mb-8 font-['Hanken_Grotesk'] text-[16px]">
            We could not load the pricing plans right now. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#370003] text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-md"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#2b1611] font-['Hanken_Grotesk']">
      {/* Full-screen overlay during payment verification — prevents user from navigating away */}
      {isProcessing && <PaymentProcessingOverlay planName={processingPlanName} />}
      <main className="pt-28 pb-20 px-4 md:px-16 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#fff0ee] text-[#370003] border border-[#E5D9C8] mb-4 shadow-sm">
            <IconMapper name="workspace_premium" className="text-sm text-[#f6be39]" /> Transparent Pricing &amp; Plans
          </div>
          <h1 className="font-['Playfair_Display'] text-[36px] md:text-[52px] leading-[44px] md:leading-[60px] font-bold mb-4 text-[#370003]">
            Invest in Your Future
          </h1>
          <p className="text-[#564240] max-w-2xl mx-auto font-['Hanken_Grotesk'] text-[18px] leading-[28px] mb-6">
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
    </div>
  );
}
