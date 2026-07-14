'use client';

import { useState, useEffect } from 'react';
import { useResumes, useResume } from '@/app/app/_hooks/use-resumes';
import { useAnalyzeResume } from '@/app/app/_hooks/use-ats';
import type { ATSAnalyzeResponse } from '@/app/app/services/ats.service';

// ---------------------------------------------------------------------------
// Helper — convert structured ResumeDetail into plain text for the API
// ---------------------------------------------------------------------------

function resumeDetailToText(resume: NonNullable<ReturnType<typeof useResume>['data']>): string {
  const lines: string[] = [];

  const pi = resume.personalInfo;
  if (pi) {
    if (pi.fullName) lines.push(pi.fullName);
    if (pi.jobTitle) lines.push(pi.jobTitle);
    if (pi.email) lines.push(pi.email);
    if (pi.phone) lines.push(pi.phone);
    if (pi.location) lines.push(pi.location);
    if (pi.summary) {
      lines.push('', 'Summary', pi.summary);
    }
  }

  if (resume.experiences?.length) {
    lines.push('', 'Experience');
    for (const exp of resume.experiences) {
      lines.push(
        `${exp.position ?? ''} at ${exp.company ?? ''} ${exp.startDate ?? ''} - ${exp.endDate ?? 'Present'}`,
      );
      if (exp.description) lines.push(exp.description);
    }
  }

  if (resume.education?.length) {
    lines.push('', 'Education');
    for (const edu of resume.education) {
      lines.push(
        `${edu.degree ?? ''} ${edu.fieldOfStudy ?? ''} ${edu.institution ?? ''} ${edu.startDate ?? ''} - ${edu.endDate ?? ''}`,
      );
    }
  }

  if (resume.skills?.length) {
    lines.push('', 'Skills');
    lines.push(resume.skills.map((s) => s.name).join('  '));
  }

  if (resume.certifications?.length) {
    lines.push('', 'Certifications');
    for (const cert of resume.certifications) {
      lines.push(`${cert.name ?? ''} ${cert.issuer ?? ''} ${cert.date ?? ''}`.trim());
    }
  }

  if (resume.projects?.length) {
    lines.push('', 'Projects');
    for (const proj of resume.projects) {
      lines.push(proj.title ?? '');
      if (proj.description) lines.push(proj.description);
    }
  }

  if (resume.languages?.length) {
    lines.push('', 'Languages');
    lines.push(resume.languages.map((l) => l.name).join('  '));
  }

  return lines.join('\n').trim();
}

// ---------------------------------------------------------------------------
// Error message helper
// ---------------------------------------------------------------------------

function errorMessage(error: Error | null): string {
  if (!error) return '';
  const msg = error.message.toLowerCase();
  if (msg.includes('unauthorized') || msg.includes('please login'))
    return 'Session expired. Please log in again.';
  if (msg.includes('timed out') || msg.includes('timeout'))
    return 'ATS analysis timed out. Please try again.';
  if (msg.includes('unavailable') || msg.includes('offline') || msg.includes('503'))
    return 'ATS service is temporarily unavailable. Please try again later.';
  if (msg.includes('invalid') || msg.includes('validation'))
    return 'Please check your inputs and try again.';
  if (msg.includes('connect') || msg.includes('network') || msg.includes('fetch'))
    return 'Unable to connect. Please check your internet connection.';
  return 'Something went wrong. Please try again.';
}

// ---------------------------------------------------------------------------
// Score colour helper
// ---------------------------------------------------------------------------

function scoreColour(score: number): string {
  if (score >= 70) return 'text-[#1B5E20]';
  if (score >= 45) return 'text-[#795900]';
  return 'text-[#ba1a1a]';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-green-50/50 border-green-200';
  if (score >= 45) return 'bg-[#ffdfa0]/50 border-[#795900]/30';
  return 'bg-[#fff0ed] border-[#ddc0bd]';
}

// ---------------------------------------------------------------------------
// Sub-scores panel
// ---------------------------------------------------------------------------

interface SubScorePanelProps {
  report: ATSAnalyzeResponse;
}

function SubScorePanel({ report }: SubScorePanelProps) {
  const scores: { label: string; value: number }[] = [
    { label: 'Keywords', value: report.keyword_score },
    { label: 'Experience', value: report.experience_score },
    { label: 'Skills', value: report.skills_score },
    { label: 'Education', value: report.education_score },
    { label: 'Summary', value: report.summary_score },
    { label: 'Formatting', value: report.formatting_score },
  ];

  return (
    <div className="space-y-2">
      <h4 className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#564240] uppercase tracking-wider mb-3">
        Sub-Scores
      </h4>
      {scores.map(({ label, value }) => (
        <div key={label}>
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">{label}</span>
            <span className={`font-['Hanken_Grotesk'] text-[12px] font-bold ${scoreColour(value)}`}>
              {value.toFixed(0)}
            </span>
          </div>
          <div className="h-1.5 bg-[#e5d9c8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${value}%`,
                backgroundColor: value >= 70 ? '#2d6a2d' : value >= 45 ? '#795900' : '#ba1a1a',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AtsAnalyzerClient() {
  const { data: resumeListData, isLoading: isLoadingResumes } = useResumes({ limit: 10 });
  const resumes = resumeListData?.data ?? [];

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Fetch the full resume detail when a resume is selected (for auto-population)
  const { data: resumeDetail, isFetching: isFetchingDetail } = useResume(selectedResumeId);

  // Auto-populate resume text when detail loads
  useEffect(() => {
    if (resumeDetail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResumeText(resumeDetailToText(resumeDetail));
    }
  }, [resumeDetail]);

  const {
    mutate: runAnalysis,
    isPending: scanning,
    data: scanResult,
    error: scanError,
    reset: resetScan,
  } = useAnalyzeResume();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const text = resumeText.trim();
    const jd = jobDescription.trim();
    if (!text || !jd) return;

    runAnalysis({ resumeText: text, jobDescriptionText: jd });
  };

  const canSubmit = !scanning && resumeText.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F2E8] p-8 md:p-12 relative">
      {/* Decorative Watermark */}
      <div className="absolute top-8 right-12 opacity-5 pointer-events-none hidden lg:block">
        <span className="material-symbols-outlined text-[100px]">analytics</span>
      </div>

      <header className="mb-10">
        <div className="font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#8a716f] uppercase tracking-wider mb-2">
          Workshop Tool
        </div>
        <h1 className="font-['Playfair_Display'] text-[32px] md:text-[40px] font-bold text-[#5b060c] leading-tight mb-2">
          ATS Analyzer &amp; Matcher
        </h1>
        <p className="font-['Hanken_Grotesk'] text-[15px] text-[#564240]">
          Audit your resume files against target corporate job descriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        {/* Left: Input parameters */}
        <div className="lg:col-span-7 bg-[#FFF8EE] border border-[#E5D9C8] p-8 shadow-sm">
          <h2 className="font-['Playfair_Display'] text-[20px] font-bold text-[#2b1611] border-b border-[#ddc0bd]/40 pb-3 mb-6">
            Initiate Document Scan
          </h2>

          <form onSubmit={handleScan} className="space-y-6">
            {/* Resume selector */}
            <div>
              <label
                htmlFor="resume-select"
                className="block font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240] uppercase tracking-wider mb-2"
              >
                1. Select Target Resume
              </label>
              {isLoadingResumes ? (
                <div className="h-10 bg-white/40 border border-[#ddc0bd] animate-pulse" />
              ) : resumes.length === 0 ? (
                <div className="p-4 bg-[#fff0ed] border border-[#ddc0bd] text-[#564240] text-[13px]">
                  No resumes found. Please create a resume first.
                </div>
              ) : (
                <select
                  id="resume-select"
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                    resetScan();
                  }}
                  className="w-full bg-white/60 border border-[#ddc0bd] px-4 py-2.5 font-['Hanken_Grotesk'] text-[14px] text-[#2b1611] focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all"
                >
                  <option value="">-- Choose from Repository --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.templateId})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Resume text — auto-populated from selected resume, or manual paste */}
            <div>
              <label
                htmlFor="resume-text"
                className="block font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240] uppercase tracking-wider mb-2"
              >
                2. Resume Text
                {isFetchingDetail && (
                  <span className="ml-2 text-[#8a716f] font-normal normal-case text-[11px]">
                    Loading…
                  </span>
                )}
              </label>
              <textarea
                id="resume-text"
                rows={6}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  resetScan();
                }}
                placeholder={
                  selectedResumeId
                    ? 'Loading resume content…'
                    : 'Paste your resume text here, or select a resume above to auto-populate.'
                }
                required
                className="w-full bg-white/60 border border-[#ddc0bd] p-4 font-['Hanken_Grotesk'] text-[14px] text-[#2b1611] placeholder-[#8a716f]/50 focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all"
              />
            </div>

            {/* Job Description */}
            <div>
              <label
                htmlFor="job-desc"
                className="block font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240] uppercase tracking-wider mb-2"
              >
                3. Target Job Description
              </label>
              <textarea
                id="job-desc"
                rows={8}
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  resetScan();
                }}
                placeholder="Paste the job description or role requirements here..."
                required
                className="w-full bg-white/60 border border-[#ddc0bd] p-4 font-['Hanken_Grotesk'] text-[14px] text-[#2b1611] placeholder-[#8a716f]/50 focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all"
              />
            </div>

            {/* Scan Action */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider hover:bg-[#7a1f1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Lexicon structure...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  Initiate Scan Audit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results or Instructions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Error state */}
          {scanError && !scanning && (
            <div className="bg-[#fff0ed] border border-[#ddc0bd] p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span className="font-['Hanken_Grotesk'] text-[13px] font-bold uppercase tracking-wider">
                  Analysis Failed
                </span>
              </div>
              <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240]">
                {errorMessage(scanError)}
              </p>
              <button
                type="button"
                onClick={() => resetScan()}
                className="self-start font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#5b060c] uppercase tracking-wider underline underline-offset-2 hover:text-[#7a1f1f] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Idle placeholder */}
          {!scanResult && !scanning && !scanError && (
            <div className="bg-[#FFF8EE] border border-[#E5D9C8] p-8 shadow-sm flex-1 flex flex-col justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-[#8a716f] mb-4">
                history_edu
              </span>
              <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
                Awaiting Document Input
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240] max-w-xs mx-auto">
                Select an active resume and paste target descriptions to see a full matching score
                audit.
              </p>
            </div>
          )}

          {/* Scanning state */}
          {scanning && (
            <div className="bg-[#FFF8EE] border border-[#E5D9C8] p-8 shadow-sm flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#5b060c]/20 border-t-[#5b060c] animate-spin mb-4" />
              <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
                Running Lexicon Parsing
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240]">
                Comparing layout architectures and mapping keywords against industry indices...
              </p>
            </div>
          )}

          {/* Success — full ATS report */}
          {scanResult && !scanning && (
            <div className="bg-[#FFF8EE] border border-[#5b060c] p-8 shadow-md space-y-6">
              {/* Header: overall score */}
              <div className="flex justify-between items-center border-b border-[#ddc0bd]/40 pb-4">
                <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c]">
                  Scan Report
                </h3>
                <span
                  className={`text-[20px] font-bold px-2 py-0.5 border ${scoreColour(scanResult.overall_score)} ${scoreBg(scanResult.overall_score)}`}
                >
                  {scanResult.overall_score.toFixed(0)}% Score
                </span>
              </div>

              {/* Sub-scores */}
              <SubScorePanel report={scanResult} />

              {/* Matched / Missing keywords */}
              <div className="border-t border-[#ddc0bd]/40 pt-4">
                <h4 className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#564240] uppercase tracking-wider mb-2">
                  Lexicon Matches
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {scanResult.matched_keywords.map((kw, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[13px] text-[#1B5E20]">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {kw.keyword}
                      {kw.matchType !== 'EXACT' && (
                        <span className="text-[10px] text-[#564240] bg-[#e5d9c8] px-1 py-0.5 uppercase">
                          {kw.matchType}
                        </span>
                      )}
                    </div>
                  ))}
                  {scanResult.missing_keywords.slice(0, 12).map((k, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[13px] text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      Missing: {k}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {(scanResult.matched_skills.length > 0 || scanResult.missing_skills.length > 0) && (
                <div className="border-t border-[#ddc0bd]/40 pt-4">
                  <h4 className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#564240] uppercase tracking-wider mb-2">
                    Skill Coverage
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.matched_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-green-50 border border-green-200 text-[#1B5E20] font-['Hanken_Grotesk']"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {scanResult.missing_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 bg-[#fff0ed] border border-[#ddc0bd] text-[#ba1a1a] font-['Hanken_Grotesk']"
                      >
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing time */}
              <p className="font-['Hanken_Grotesk'] text-[11px] text-[#8a716f] text-right pt-1">
                Analyzed in {(scanResult.processing_time_ms / 1000).toFixed(2)}s
              </p>
            </div>
          )}

          {/* Guidelines info card — always visible */}
          <div className="bg-[#ffdfa0] p-6 shadow-sm border-b-4 border-[#795900]/20">
            <h4 className="font-['Hanken_Grotesk'] text-[13px] font-bold text-[#795900] uppercase tracking-wider mb-2">
              Parser Guidelines
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[13px] leading-relaxed text-[#261a00]">
              Recruitment parsers convert your PDF into plain ASCII text. Keep your headings
              standard (e.g. Work Experience, Education) and use a clear linear layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
