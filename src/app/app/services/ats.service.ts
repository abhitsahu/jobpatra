'use client';

/**
 * Frontend ATS service — the only file in `src/app/app` that knows
 * the API path for ATS analysis.
 *
 * Components must never call fetch() directly.
 * The hook (use-ats.ts) calls this service.
 * This service calls the API client.
 *
 * Does NOT contain:
 *   - UI logic
 *   - State management
 *   - React imports
 */

import { analyzeATSClient } from '@/app/api/client/ats/ats-client';
import type { ATSAnalyzeResponse } from '@/app/service/ai/types';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ATSAnalyzeInput {
  resumeText: string;
  jobDescriptionText: string;
}

export type { ATSAnalyzeResponse };

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Submit a resume + job description for deterministic ATS analysis.
 *
 * @param input - resume text and job description text
 * @returns Typed ATS report from the AI service
 */
export async function analyzeResume(input: ATSAnalyzeInput): Promise<ATSAnalyzeResponse> {
  return analyzeATSClient(input);
}
