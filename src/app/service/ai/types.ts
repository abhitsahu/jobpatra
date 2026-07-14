/**
 * ATS types — TypeScript interfaces matching the Python ATSAnalyzeResponse.
 *
 * These types define the contract between Next.js and the Python AI service.
 * They must stay in sync with `app/schemas/ats.py` on the Python side.
 *
 * Server-side only — never import from client components.
 */

// ---------------------------------------------------------------------------
// Request types (what we send TO the AI service)
// ---------------------------------------------------------------------------

export interface ATSAnalyzeRequestBody {
  resume: {
    /** Raw resume text. Mutually exclusive with filename+file_bytes. */
    text?: string;
    /** Original filename (e.g. "resume.pdf"). */
    filename?: string;
    /** Base64-encoded file content. */
    file_bytes?: string;
  };
  job_description: {
    /** Raw job description text. */
    text: string;
  };
}

// ---------------------------------------------------------------------------
// Response types (what we receive FROM the AI service)
// ---------------------------------------------------------------------------

export interface MatchedKeyword {
  keyword: string;
  matchType: 'EXACT' | 'SYNONYM' | 'FUZZY' | 'SEMANTIC';
  similarity: number | null;
}

export interface ExperienceSummary {
  total_entries: number;
  total_years: number;
  has_metrics: boolean;
}

export interface EducationSummary {
  highest_degree: string | null;
  certifications: string[];
}

export interface ATSAnalyzeResponse {
  // Scores (all 0–100)
  overall_score: number;
  keyword_score: number;
  experience_score: number;
  skills_score: number;
  education_score: number;
  summary_score: number;
  formatting_score: number;

  // Keyword matching
  matched_keywords: MatchedKeyword[];
  missing_keywords: string[];

  // Skill coverage
  matched_skills: string[];
  missing_skills: string[];

  // Extracted metadata
  experience_summary: ExperienceSummary;
  education_summary: EducationSummary;

  // Meta
  processing_time_ms: number;
  version: string;
}
