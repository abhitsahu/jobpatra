import React from 'react';
import type { Metadata } from 'next';
import { PricingClient } from './pricing-client';

// ─────────────────────────────────────────────────────────────────────────────
// METADATA (SEO)
// Descriptive title tags and meta descriptions for search engines.
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Pricing Plans | JobPatra - AI Career Workshop',
  description:
    'Choose the perfect plan for your career growth. Flexible monthly or yearly billing, advanced ATS optimization, resume templates, and AI writing assistant.',
};

export default function PricingPage() {
  return <PricingClient />;
}
