// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION PLAN
// Mirrors the `plan` String field in the Subscription Prisma model.
// When you add a new plan (e.g. ENTERPRISE), add it here and to PricingPlan slugs.
// ─────────────────────────────────────────────────────────────────────────────

export enum Plan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION STATUS
// Mirrors the `status` String field in the Subscription Prisma model.
// ─────────────────────────────────────────────────────────────────────────────

export enum SubStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE TRACKING ACTIONS
// Mirrors the `action` String field in the UsageTracking Prisma model.
// ─────────────────────────────────────────────────────────────────────────────

export enum UsageAction {
  RESUME_CREATED = 'RESUME_CREATED',
  AI_SUGGESTION = 'AI_SUGGESTION',
  ATS_ANALYSIS = 'ATS_ANALYSIS',
  PDF_DOWNLOAD = 'PDF_DOWNLOAD',
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING BUTTON VARIANT
// Controls the visual style of the CTA button on each pricing card.
// ─────────────────────────────────────────────────────────────────────────────

export enum ButtonVariant {
  SOLID = 'solid',
  OUTLINE = 'outline',
}
