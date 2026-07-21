import { apiFetch } from '@/app/api/client/_utils/api-client';
import type { PricingPageResponse } from '@/app/api/model/response/pricing';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET PRICING PAGE DATA
// Single function for the entire pricing page — plans + comparison + testimonials
// ─────────────────────────────────────────────────────────────────────────────

export async function getPricingClient(): Promise<PricingPageResponse> {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const currency = params?.get('currency');
  const url = currency ? `/api/public/pricing?currency=${currency}` : '/api/public/pricing';
  const res = await apiFetch<ApiResponse<PricingPageResponse>>(url);
  return res.data;
}
