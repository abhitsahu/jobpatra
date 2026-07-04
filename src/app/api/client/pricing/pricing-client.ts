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
  const res = await apiFetch<ApiResponse<PricingPageResponse>>('/api/public/pricing');
  return res.data;
}
