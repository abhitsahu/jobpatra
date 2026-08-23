/**
 * ATS API client — browser-side functions for the ATS analysis endpoint.
 *
 * Follows the same pattern as resume-client.ts:
 *   - Uses apiFetch() from _utils/api-client.ts
 *   - Calls the Next.js API route (NOT the Python service directly)
 *   - Returns typed data
 *
 * The frontend calls /api/ats/analyze → Next.js backend → Python AI service.
 * The frontend never knows about the Python service.
 */

import { apiFetch } from '@/app/api/client/_utils/api-client';
import type { ATSAnalyzeResponse } from '@/app/service/ai/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ATSAnalyzeApiResponse {
  success: boolean;
  data: ATSAnalyzeResponse;
  requestId: string;
}

export interface ATSAnalyzeInput {
  resumeText?: string;
  resumeFileName?: string;
  resumeFileBytes?: string;
  jobDescriptionText: string;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Submit a resume + JD for ATS analysis.
 *
 * @param input - resume text and job description text
 * @returns The ATS report from the AI service
 */
export async function analyzeATSClient(input: ATSAnalyzeInput): Promise<ATSAnalyzeResponse> {
  const res = await apiFetch<ATSAnalyzeApiResponse>('/api/ats/analyze', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return res.data;
}

export interface ExtractJdClientResponse {
  success: boolean;
  text: string;
  source: 'httpx' | 'playwright';
  charCount: number;
  requestId: string;
}

/**
 * Extract job description text from a target URL.
 *
 * @param url - target job posting URL
 * @returns Extracted text and metadata
 */
export async function extractJdFromUrlClient(url: string): Promise<ExtractJdClientResponse> {
  return await apiFetch<ExtractJdClientResponse>('/api/ats/extract-jd', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

