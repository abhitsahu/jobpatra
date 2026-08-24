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

export function PricingClient() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlanName, setProcessingPlanName] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = usePricing();

  const handleSelectPlan = async (slug: string) => {
    try {
      setLoadingPlan(slug);
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
        setLoadingPlan(null);
        return;
      }

      // 2. Handle immediate activation for free plan
      if (orderRes.isFree) {
        router.push('/app/settings?section=subscription&payment=success');
        router.refresh();
        setLoadingPlan(null);
        return;
      }

      // 3. Dynamically load Razorpay Checkout script if not loaded
      if (!(window as any).Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert('Failed to load payment gateway script. Please check your internet connection.');
          setLoadingPlan(null);
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
            setLoadingPlan(slug);

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
            setLoadingPlan(null);
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
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout failed:', err);
      alert(err.message || 'An error occurred during checkout initialization.');
      setLoadingPlan(null);
    }
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
    <>
      {/* Full-screen overlay during payment verification — prevents user from navigating away */}
      {isProcessing && <PaymentProcessingOverlay planName={processingPlanName} />}
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
    </>
  );
}
