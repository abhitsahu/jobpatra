import { prisma } from '@/app/_lib/prisma';
import type {
  PricingPageResponse,
  PricingPlanResponse,
  ComparisonFeatureResponse,
  TestimonialResponse,
} from '@/app/api/model/response/pricing';

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — used when DB tables are empty or not yet migrated
// Mirrors the visual design from the HTML source of truth.
// ─────────────────────────────────────────────────────────────────────────────

const SEED_PLANS = [
  {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    currency: 'USD',
    description: 'Essential tools for starting your career journey.',
    badge: null,
    badgeColor: null,
    buttonText: 'Select Plan',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 0,
    isActive: true,
    features: [
      {
        id: 'ff1',
        feature: '1 Basic Resume Template',
        available: true,
        highlight: false,
        order: 0,
      },
      {
        id: 'ff2',
        feature: '3 AI Content Suggestions',
        available: true,
        highlight: false,
        order: 1,
      },
      { id: 'ff3', feature: 'PDF Export Only', available: true, highlight: false, order: 2 },
    ],
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    monthlyPrice: 19,
    yearlyPrice: 182.4,
    yearlyDiscount: 20,
    currency: 'USD',
    description: 'Advanced AI tools for serious job seekers and career growth.',
    badge: 'Most Popular',
    badgeColor: 'primary',
    buttonText: 'Most Popular',
    buttonVariant: 'solid',
    isPopular: true,
    displayOrder: 1,
    isActive: true,
    features: [
      {
        id: 'pf1',
        feature: 'Unlimited Premium Templates',
        available: true,
        highlight: true,
        order: 0,
      },
      { id: 'pf2', feature: 'Advanced ATS Analysis', available: true, highlight: false, order: 1 },
      {
        id: 'pf3',
        feature: 'Cover Letter AI Generator',
        available: true,
        highlight: false,
        order: 2,
      },
      { id: 'pf4', feature: 'Custom Font Selection', available: true, highlight: false, order: 3 },
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    monthlyPrice: 49,
    yearlyPrice: 470.4,
    yearlyDiscount: 20,
    currency: 'USD',
    description: 'Scalable solutions for teams and recruitment agencies.',
    badge: null,
    badgeColor: null,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 2,
    isActive: true,
    features: [
      { id: 'ef1', feature: 'Everything in Pro', available: true, highlight: false, order: 0 },
      { id: 'ef2', feature: 'Whitelabeling Options', available: true, highlight: false, order: 1 },
      {
        id: 'ef3',
        feature: 'API Access for Bulk Exports',
        available: true,
        highlight: false,
        order: 2,
      },
    ],
  },
];

const SEED_COMPARISON: ComparisonFeatureResponse[] = [
  {
    id: 'cf1',
    title: 'Resume Builder',
    values: { free: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
    order: 0,
  },
  {
    id: 'cf2',
    title: 'ATS Optimization',
    values: { free: '—', pro: 'check', enterprise: 'check' },
    order: 1,
  },
  {
    id: 'cf3',
    title: 'AI Writing Assistant',
    values: { free: 'Limited', pro: 'Unlimited', enterprise: 'Unlimited' },
    order: 2,
  },
  {
    id: 'cf4',
    title: 'Collaborative Editing',
    values: { free: '—', pro: '—', enterprise: 'check' },
    order: 3,
  },
  {
    id: 'cf5',
    title: 'Analytics Dashboard',
    values: { free: '—', pro: 'Standard', enterprise: 'Advanced' },
    order: 4,
  },
];

const SEED_TESTIMONIALS: TestimonialResponse[] = [
  {
    id: 't1',
    name: 'Eleanor Vance',
    designation: 'Senior Product Manager at TechFlow',
    company: 'TechFlow',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBIiym9vzN3Gqu8IzaK42NgnKgF9ZPvJ5QELA2cCMETmmaP92NvR3K5agyluIhzXVPQDctoe8XJEXN6FO-MpLCvdnDO6c2MU_U5IttDHm5zPVeQhKIF80t9krhOj-dJYGRSKppJuHK9IX26MvM2d_NVHcJisZZN5-ZZ0cC9RWu8VdtUeMR0sjgjBAizEU80eEamqu_JnKNzm97sDCekPwSW5Ijplsi0L73X2ROtWCsOgR5uGK9_5U9Kb1bPnMM4d25jsXdZBnHVXAd',
    review:
      'JobPatra transformed my job search. Within two weeks of upgrading to Pro, I landed three interviews at Fortune 500 companies. The ATS analysis is a game-changer.',
    rating: 5,
    order: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED DB — inserts default data when tables are empty
// Safe to call multiple times (checks before inserting)
// ─────────────────────────────────────────────────────────────────────────────

async function seedPricingData(): Promise<void> {
  for (const plan of SEED_PLANS) {
    const { features, ...planData } = plan;
    await prisma.pricingPlan.upsert({
      where: { slug: planData.slug },
      update: {},
      create: {
        ...planData,
        features: { create: features.map(({ id: _id, ...f }) => f) },
      },
    });
  }

  for (const cf of SEED_COMPARISON) {
    await prisma.comparisonFeature.upsert({
      where: { id: cf.id },
      update: {},
      create: { id: cf.id, title: cf.title, values: cf.values, order: cf.order },
    });
  }

  for (const t of SEED_TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatPlan(plan: {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  currency: string;
  description: string;
  badge: string | null;
  badgeColor: string | null;
  buttonText: string;
  buttonVariant: string;
  isPopular: boolean;
  displayOrder: number;
  features: {
    id: string;
    feature: string;
    available: boolean;
    highlight: boolean;
    order: number;
  }[];
}): PricingPlanResponse {
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice: plan.yearlyPrice,
    yearlyDiscount: plan.yearlyDiscount,
    currency: plan.currency,
    description: plan.description,
    badge: plan.badge,
    badgeColor: plan.badgeColor,
    buttonText: plan.buttonText,
    buttonVariant: plan.buttonVariant,
    isPopular: plan.isPopular,
    displayOrder: plan.displayOrder,
    features: plan.features.map((f) => ({
      id: f.id,
      feature: f.feature,
      available: f.available,
      highlight: f.highlight,
      order: f.order,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SERVICE FUNCTION
// Strategy:
//   1. Query DB for active plans + comparison + testimonials
//   2. If tables exist but are empty → auto-seed then return seeded data
//   3. If tables don't exist yet (migration not run) → return static fallback
// This ensures the pricing page works in ALL environments immediately.
// ─────────────────────────────────────────────────────────────────────────────

export async function getPricingPage(): Promise<PricingPageResponse> {
  try {
    const [plans, comparison, testimonials] = await Promise.all([
      prisma.pricingPlan.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { features: { orderBy: { order: 'asc' } } },
      }),
      prisma.comparisonFeature.findMany({ orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    // Auto-seed on first use
    if (plans.length === 0) {
      await seedPricingData();
      return getPricingPage();
    }

    const globalDiscount = Math.max(0, ...plans.map((p) => p.yearlyDiscount));

    return {
      plans: plans.map(formatPlan),
      comparison: comparison.map((c) => ({
        id: c.id,
        title: c.title,
        values: c.values as Record<string, string>,
        order: c.order,
      })),
      testimonials: testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        designation: t.designation,
        company: t.company,
        image: t.image,
        review: t.review,
        rating: t.rating,
        order: t.order,
      })),
      globalDiscount,
    };
  } catch (err) {
    // Migration not yet run or DB unavailable → return static fallback
    console.warn('[pricing.service] DB unavailable, using static fallback:', err);
    return {
      plans: SEED_PLANS.map(formatPlan),
      comparison: SEED_COMPARISON,
      testimonials: SEED_TESTIMONIALS,
      globalDiscount: 20,
    };
  }
}
