'use client';

import { useMutation } from '@tanstack/react-query';
import { analyzeResume } from '@/app/app/services/ats.service';
import type { ATSAnalyzeInput, ATSAnalyzeResponse } from '@/app/app/services/ats.service';

// ---------------------------------------------------------------------------
// Public types — re-exported so components only import from this file
// ---------------------------------------------------------------------------

export type { ATSAnalyzeInput, ATSAnalyzeResponse };

// ---------------------------------------------------------------------------
// Mutation hook
// ---------------------------------------------------------------------------

/**
 * React Query mutation hook for ATS resume analysis.
 *
 * Usage:
 *   const { mutate, isPending, data, error } = useAnalyzeResume();
 *   mutate({ resumeText, jobDescriptionText });
 *
 * - isPending  → show spinner, disable button
 * - data       → render ATS report
 * - error      → render error message
 * - isIdle     → show "Awaiting Document Input" placeholder
 */
export function useAnalyzeResume() {
  return useMutation<ATSAnalyzeResponse, Error, ATSAnalyzeInput>({
    mutationFn: analyzeResume,
  });
}
