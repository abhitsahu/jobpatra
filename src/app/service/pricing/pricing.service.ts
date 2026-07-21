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

const PLANS_INR = [
  {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    quarterlyDiscount: 0,
    currency: 'INR',
    description: 'Lifetime free access for basic job seeking.',
    badge: null,
    badgeColor: null,
    buttonText: 'Select Plan',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 0,
    isActive: true,
    limitResumeCreate: 3,
    limitAtsAnalysis: 1,
    limitAiSuggestion: 1,
    limitDownloadPdf: 3,
    features: [
      { id: 'ff1', feature: 'Select only free templates', available: true, highlight: false, order: 0 },
      { id: 'ff2', feature: '1 ATS Score & AI Suggestion per month', available: true, highlight: false, order: 1 },
    ],
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    monthlyPrice: 99,
    quarterlyPrice: 316,
    quarterlyDiscount: 20,
    currency: 'INR',
    description: 'All templates and standard AI checking limit.',
    badge: 'Most Popular',
    badgeColor: 'primary',
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'solid',
    isPopular: true,
    displayOrder: 1,
    isActive: true,
    limitResumeCreate: 15,
    limitAtsAnalysis: 15,
    limitAiSuggestion: 15,
    limitDownloadPdf: 15,
    features: [
      { id: 'pf1', feature: 'Select all templates', available: true, highlight: true, order: 0 },
      { id: 'pf2', feature: '15 ATS Score & AI Suggestions per month', available: true, highlight: false, order: 1 },
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    monthlyPrice: 149,
    quarterlyPrice: 476,
    quarterlyDiscount: 20,
    currency: 'INR',
    description: 'For power users needing higher checking limits.',
    badge: null,
    badgeColor: null,
    buttonText: 'Upgrade to Enterprise',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 2,
    isActive: true,
    limitResumeCreate: 25,
    limitAtsAnalysis: 25,
    limitAiSuggestion: 25,
    limitDownloadPdf: 25,
    features: [
      { id: 'ef1', feature: 'Select all templates', available: true, highlight: true, order: 0 },
      { id: 'ef2', feature: '25 ATS Score & AI Suggestions per month', available: true, highlight: false, order: 1 },
    ],
  },
];

const PLANS_USD = [
  {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    quarterlyDiscount: 0,
    currency: 'USD',
    description: 'Lifetime free access for basic job seeking.',
    badge: null,
    badgeColor: null,
    buttonText: 'Select Plan',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 0,
    isActive: true,
    limitResumeCreate: 3,
    limitAtsAnalysis: 1,
    limitAiSuggestion: 1,
    limitDownloadPdf: 3,
    features: [
      { id: 'ff1_usd', feature: 'Select only free templates', available: true, highlight: false, order: 0 },
      { id: 'ff2_usd', feature: '1 ATS Score & AI Suggestion per month', available: true, highlight: false, order: 1 },
    ],
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    monthlyPrice: 9,
    quarterlyPrice: 28.8,
    quarterlyDiscount: 20,
    currency: 'USD',
    description: 'All templates and standard AI checking limit.',
    badge: 'Most Popular',
    badgeColor: 'primary',
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'solid',
    isPopular: true,
    displayOrder: 1,
    isActive: true,
    limitResumeCreate: 15,
    limitAtsAnalysis: 15,
    limitAiSuggestion: 15,
    limitDownloadPdf: 15,
    features: [
      { id: 'pf1_usd', feature: 'Select all templates', available: true, highlight: true, order: 0 },
      { id: 'pf2_usd', feature: '15 ATS Score & AI Suggestions per month', available: true, highlight: false, order: 1 },
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    monthlyPrice: 15,
    quarterlyPrice: 48,
    quarterlyDiscount: 20,
    currency: 'USD',
    description: 'For power users needing higher checking limits.',
    badge: null,
    badgeColor: null,
    buttonText: 'Upgrade to Enterprise',
    buttonVariant: 'outline',
    isPopular: false,
    displayOrder: 2,
    isActive: true,
    limitResumeCreate: 25,
    limitAtsAnalysis: 25,
    limitAiSuggestion: 25,
    limitDownloadPdf: 25,
    features: [
      { id: 'ef1_usd', feature: 'Select all templates', available: true, highlight: true, order: 0 },
      { id: 'ef2_usd', feature: '25 ATS Score & AI Suggestions per month', available: true, highlight: false, order: 1 },
    ],
  },
];

const SEED_PLANS = PLANS_INR;

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

// [ignoring loop detection]
export async function seedPricingData(): Promise<void> {
  for (const plan of SEED_PLANS) {
    const { features, ...planData } = plan;
    await prisma.pricingPlan.upsert({
      where: { slug: planData.slug },
      update: {
        limitResumeCreate: planData.limitResumeCreate,
        limitAtsAnalysis: planData.limitAtsAnalysis,
        limitAiSuggestion: planData.limitAiSuggestion,
        limitDownloadPdf: planData.limitDownloadPdf,
      },
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
  quarterlyPrice: number;
  quarterlyDiscount: number;
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
    quarterlyPrice: plan.quarterlyPrice,
    quarterlyDiscount: plan.quarterlyDiscount,
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

export async function getPricingPage(currency: string = 'INR'): Promise<PricingPageResponse> {
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
      return getPricingPage(currency);
    }

    const activePlansList = currency === 'USD' ? PLANS_USD : PLANS_INR;

    const mappedPlans = plans.map((dbPlan) => {
      const override = activePlansList.find((p) => p.slug === dbPlan.slug);
      if (!override) return formatPlan(dbPlan);
      
      return {
        id: dbPlan.id,
        name: override.name,
        slug: dbPlan.slug,
        monthlyPrice: override.monthlyPrice,
        quarterlyPrice: override.quarterlyPrice, // Stores Quarterly Price
        quarterlyDiscount: override.quarterlyDiscount, // Stores Quarterly Discount
        currency: override.currency,
        description: override.description,
        badge: dbPlan.badge,
        badgeColor: dbPlan.badgeColor,
        buttonText: override.buttonText,
        buttonVariant: dbPlan.buttonVariant,
        isPopular: dbPlan.isPopular,
        displayOrder: dbPlan.displayOrder,
        features: override.features.map((f) => ({
          id: f.id,
          feature: f.feature,
          available: f.available,
          highlight: f.highlight,
          order: f.order,
        })),
      };
    });

    const globalDiscount = Math.max(0, ...mappedPlans.map((p) => p.quarterlyDiscount));

    return {
      plans: mappedPlans,
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
    const activeFallback = currency === 'USD' ? PLANS_USD : PLANS_INR;
    return {
      plans: activeFallback.map(formatPlan),
      comparison: SEED_COMPARISON,
      testimonials: SEED_TESTIMONIALS,
      globalDiscount: 20,
    };
  }
}
