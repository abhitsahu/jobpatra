/**
 * ATS Service — orchestrates ATS analysis via the AI microservice.
 *
 * This module is the ONLY file that knows about the ATS endpoint path.
 * Route handlers call this service; this service calls the AI client.
 *
 * Responsibilities:
 *   1. Accept resume text and JD text from the route handler
 *   2. Build the request body matching ATSAnalyzeRequestBody
 *   3. Call the AI service via the reusable AI client
 *   4. Return the typed ATSAnalyzeResponse
 *
 * This module does NOT:
 *   - know about HTTP details (status codes, headers)
 *   - parse files or extract text
 *   - perform any ATS logic
 *
 * Server-side only.
 */

import { aiRequest, type AIClientOptions } from '@/app/service/ai/client';
import type { ATSAnalyzeRequestBody, ATSAnalyzeResponse } from '@/app/service/ai/types';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface AnalyzeATSParams {
  /** Resume as raw text. */
  resumeText: string;
  /** Job description as raw text. */
  jobDescriptionText: string;
}

export interface AnalyzeATSResult {
  /** The full ATS report from the AI service. */
  report: ATSAnalyzeResponse;
  /** The request ID used for this call (for tracing). */
  requestId: string;
}

/**
 * Run deterministic ATS analysis on a resume + job description.
 *
 * @param params   - resume text and JD text
 * @param options  - optional timeout override, caller request ID
 *
 * @returns The ATS report and the request ID for distributed tracing.
 *
 * @throws AIServiceError on auth failures, validation errors, timeouts, or network issues.
 */
export async function analyzeATS(
  params: AnalyzeATSParams,
  options?: AIClientOptions,
): Promise<AnalyzeATSResult> {
  const body: ATSAnalyzeRequestBody = {
    resume: { text: params.resumeText },
    job_description: { text: params.jobDescriptionText },
  };

  const { data, requestId } = await aiRequest<ATSAnalyzeResponse>(
    '/v1/ats/analyze',
    { method: 'POST', body },
    options,
  );

  return { report: data, requestId };
}
