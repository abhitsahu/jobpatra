import { NextResponse } from 'next/server';
import { getPricingPage } from '@/app/service/pricing/pricing.service';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/public/pricing
//
// Public endpoint — no authentication required.
// Returns everything needed for the pricing page in a single round-trip:
//   - Active pricing plans (with features)
//   - Feature comparison table rows
//   - Testimonials
//   - Global yearly discount percentage for the toggle badge
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const data = await getPricingPage();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/public/pricing]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to load pricing data' },
      { status: 500 },
    );
  }
}
