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

import { aiRequest, aiRequestStream, type AIClientOptions } from '@/app/service/ai/client';
import type { ATSAnalyzeRequestBody, ATSAnalyzeResponse } from '@/app/service/ai/types';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface AnalyzeATSParams {
  /** Resume as raw text. */
  resumeText?: string;
  resumeFileName?: string;
  resumeFileBytes?: string;
  /** Job description as raw text. */
  jobDescriptionText: string;
}

export interface AnalyzeATSResult {
  /** The full ATS report from the AI service. */
  report: ATSAnalyzeResponse;
  /** The request ID used for this call (for tracing). */
  requestId: string;
}

export interface AnalyzeATSStreamResult {
  /** The readable stream from the AI service. */
  stream: ReadableStream<Uint8Array>;
  /** The request ID used for this call. */
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
    resume:
      params.resumeFileBytes && params.resumeFileName
        ? { filename: params.resumeFileName, file_bytes: params.resumeFileBytes }
        : { text: params.resumeText },
    job_description: { text: params.jobDescriptionText },
    stream: false,
  };

  const { data, requestId } = await aiRequest<ATSAnalyzeResponse>(
    '/v1/ats/analyze',
    { method: 'POST', body },
    options,
  );

  return { report: data, requestId };
}

// [ignoring loop detection]
/**
 * Run deterministic ATS analysis on a resume + job description and stream progress.
 */
export async function analyzeATSStream(
  params: AnalyzeATSParams,
  options?: AIClientOptions,
): Promise<AnalyzeATSStreamResult> {
  const body: ATSAnalyzeRequestBody & { stream: boolean } = {
    resume:
      params.resumeFileBytes && params.resumeFileName
        ? { filename: params.resumeFileName, file_bytes: params.resumeFileBytes }
        : { text: params.resumeText },
    job_description: { text: params.jobDescriptionText },
    stream: true,
  };

  const { stream, requestId } = await aiRequestStream(
    '/v1/ats/analyze',
    { method: 'POST', body },
    options,
  );

  return { stream, requestId };
}

export interface ExtractJdResult {
  text: string;
  source: 'httpx' | 'playwright';
  char_count: number;
  url: string;
}

/**
 * Extract job description text from a public URL using 2-tier AI backend scraping.
 */
export async function extractJdFromUrl(
  url: string,
  options?: AIClientOptions,
): Promise<{ result: ExtractJdResult; requestId: string }> {
  const { data, requestId } = await aiRequest<ExtractJdResult>(
    '/v1/jd/extract',
    { method: 'POST', body: { url } },
    { timeoutMs: 35_000, ...options }, // Playwright Tier 2 can take up to 25s
  );

  return { result: data, requestId };
}

