'use client';

import { useState } from 'react';
import { useResumes } from '@/app/app/_hooks/use-resumes';

export function AtsAnalyzerClient() {
  const { data, isLoading } = useResumes({ limit: 10 });
  const resumes = data?.data ?? [];

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    score: number;
    matchCount: number;
    missingKeywords: string[];
    foundKeywords: string[];
    formattingTips: string[];
  }>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !jobDescription.trim()) return;

    setScanning(true);
    setScanResult(null);

    // Mock scanning transition
    setTimeout(() => {
      setScanning(false);
      setScanResult({
        score: 79,
        matchCount: 8,
        missingKeywords: [
          'CI/CD Pipelines',
          'Kubernetes Orchestration',
          'Microservices Optimization',
        ],
        foundKeywords: [
          'React/Next.js Framework',
          'TypeScript Integrity',
          'RESTful API Architecture',
          'State Observers',
        ],
        formattingTips: [
          'Warning: Double-column layout detected. Convert to a single-column layout for legacy ATS parsers.',
          'Tip: Avoid progress bar graphics to represent skill levels.',
        ],
      });
    }, 2000);
  };

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
          ATS Analyzer & Matcher
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
              {isLoading ? (
                <div className="h-10 bg-white/40 border border-[#ddc0bd] animate-pulse" />
              ) : resumes.length === 0 ? (
                <div className="p-4 bg-[#fff0ed] border border-[#ddc0bd] text-[#564240] text-[13px]">
                  No resumes found. Please create a resume first.
                </div>
              ) : (
                <select
                  id="resume-select"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  required
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

            {/* Job Description */}
            <div>
              <label
                htmlFor="job-desc"
                className="block font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240] uppercase tracking-wider mb-2"
              >
                2. Target Job Description
              </label>
              <textarea
                id="job-desc"
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or role requirements here..."
                required
                className="w-full bg-white/60 border border-[#ddc0bd] p-4 font-['Hanken_Grotesk'] text-[14px] text-[#2b1611] placeholder-[#8a716f]/50 focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all"
              />
            </div>

            {/* Scan Action */}
            <button
              type="submit"
              disabled={scanning || resumes.length === 0}
              className="w-full py-3 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider hover:bg-[#7a1f1f] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
          {!scanResult && !scanning ? (
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
          ) : scanning ? (
            <div className="bg-[#FFF8EE] border border-[#E5D9C8] p-8 shadow-sm flex-1 flex flex-col justify-center items-center text-center animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-[#5b060c]/20 border-t-[#5b060c] animate-spin mb-4" />
              <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
                Running Lexicon Parsing
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240]">
                Comparing layout architectures and mapping keywords against industry indices...
              </p>
            </div>
          ) : (
            scanResult && (
              <div className="bg-[#FFF8EE] border border-[#5b060c] p-8 shadow-md space-y-6">
                <div className="flex justify-between items-center border-b border-[#ddc0bd]/40 pb-4">
                  <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c]">
                    Scan Report
                  </h3>
                  <span className="text-[20px] font-bold text-[#1B5E20] bg-green-50/50 px-2 py-0.5 border border-green-200">
                    {scanResult.score}% Score
                  </span>
                </div>

                {/* Found / Missing keywords */}
                <div>
                  <h4 className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#564240] uppercase tracking-wider mb-2">
                    Lexicon Matches
                  </h4>
                  <div className="space-y-1.5">
                    {scanResult.foundKeywords.map((k, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[13px] text-[#1B5E20]">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {k}
                      </div>
                    ))}
                    {scanResult.missingKeywords.map((k, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[13px] text-[#ba1a1a]">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        Missing: {k}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formatting Suggestions */}
                <div className="border-t border-[#ddc0bd]/40 pt-4">
                  <h4 className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#564240] uppercase tracking-wider mb-2">
                    Formatting Audits
                  </h4>
                  <ul className="space-y-2">
                    {scanResult.formattingTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-[13px] text-[#564240] leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-[#5b060c] font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}

          {/* Guidelines info card */}
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
