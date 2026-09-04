/**
 * Resume Improve Service — client-side fetch wrapper.
 *
 * This is the ONLY place that calls ``/api/resume/ai-improve``.
 * It returns the raw ``Response`` so the caller can stream the body.
 *
 * Client-side only — never import from server components or route handlers.
 */

import type {
  AIImproveSectionType,
  AIImproveRequestDTO,
} from '@/app/api/model/request/resume/ai-improve';

export type SectionType = AIImproveSectionType;

export interface ResumeImproveParams {
  sectionType: SectionType;
  currentText: string;
  resumeContext?: string;
}

/**
 * Send an improvement request and return the raw streaming ``Response``.
 *
 * The caller is responsible for reading the SSE body:
 *   - Each event:  ``data: {"token": "<text>"}``
 *   - Terminal:    ``data: [DONE]``
 *   - Error event: ``event: error\ndata: {"code": "...", "message": "..."}``
 *
 * @throws Error if the HTTP response is not ok (non-2xx).
 */
export async function streamResumeImprovement(params: ResumeImproveParams): Promise<Response> {
  const response = await fetch('/api/resume/ai-improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    // Parse JSON error body if possible
    const body = await response.json().catch(() => null);
    const message =
      body?.message ?? `AI improvement request failed with status ${response.status}`;
    const error = new Error(message) as Error & { status: number; remaining?: number };
    error.status = response.status;
    error.remaining = body?.remaining;
    throw error;
  }

  return response;
}
