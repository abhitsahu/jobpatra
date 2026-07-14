/**
 * POST /api/ats/analyze — ATS analysis endpoint.
 *
 * This route handler:
 *   1. Authenticates the user (NextAuth session)
 *   2. Validates the request body (Zod)
 *   3. Delegates to the ATS service
 *   4. Maps errors to appropriate HTTP responses
 *
 * It does NOT:
 *   - call the AI service directly
 *   - perform any ATS logic
 *   - expose internal error details to the frontend
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/app/api/(controller)/_util/auth-guard';
import { validateRequest } from '@/app/api/(controller)/_util/validate';
import { analyzeATS } from '@/app/service/ai/ats.service';
import { AIServiceError } from '@/app/service/ai/client';

// ---------------------------------------------------------------------------
// Request validation schema
// ---------------------------------------------------------------------------

const atsAnalyzeSchema = z.object({
  resumeText: z.string().min(1, 'Resume text is required'),
  jobDescriptionText: z.string().min(1, 'Job description text is required'),
});

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    // 1. Auth
    const { error } = await requireAuth();
    if (error) return error;

    // 2. Validate
    const result = await validateRequest(req, atsAnalyzeSchema);
    if (result.error) return result.error;

    // 3. Delegate to ATS service
    const { report, requestId } = await analyzeATS({
      resumeText: result.data.resumeText,
      jobDescriptionText: result.data.jobDescriptionText,
    });

    // 4. Return success
    return NextResponse.json(
      {
        success: true,
        data: report,
        requestId,
      },
      {
        status: 200,
        headers: { 'X-Request-ID': requestId },
      },
    );
  } catch (err) {
    return _handleError(err);
  }
}

// ---------------------------------------------------------------------------
// Error mapping
// ---------------------------------------------------------------------------

function _handleError(err: unknown): NextResponse {
  if (err instanceof AIServiceError) {
    console.error(
      `[POST /api/ats/analyze] [${err.requestId.slice(0, 8)}] AI error: ${err.status} ${err.code} — ${err.message}`,
    );

    // Map Python status codes to user-facing responses
    switch (err.status) {
      case 401:
        return NextResponse.json(
          { success: false, message: 'AI service authentication failed' },
          { status: 502 },
        );
      case 422:
        return NextResponse.json(
          { success: false, message: 'Invalid data sent to AI service' },
          { status: 400 },
        );
      case 504:
        return NextResponse.json(
          { success: false, message: 'AI service timed out. Please try again.' },
          { status: 504 },
        );
      case 503:
        return NextResponse.json(
          {
            success: false,
            message: 'AI service is currently unavailable. Please try again later.',
          },
          { status: 503 },
        );
      default:
        return NextResponse.json(
          { success: false, message: 'AI service encountered an error' },
          { status: 502 },
        );
    }
  }

  // Unexpected error — never expose stack traces
  console.error('[POST /api/ats/analyze] Unexpected error:', err);
  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
