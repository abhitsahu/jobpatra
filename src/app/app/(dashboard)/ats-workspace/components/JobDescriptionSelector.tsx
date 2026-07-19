'use client';

import { useState } from 'react';

interface JobDescriptionSelectorProps {
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function JobDescriptionSelector({
  jobDescriptionText,
  setJobDescriptionText,
  onValidationChange,
}: JobDescriptionSelectorProps) {
  const [tab, setTab] = useState<'paste' | 'url'>('paste');
  const [urlInput, setUrlInput] = useState('');

  const handleTabChange = (newTab: 'paste' | 'url') => {
    setTab(newTab);
    // Reset validations and text on mode change
    setJobDescriptionText('');
    setUrlInput('');
    onValidationChange(false);
  };

  const handleTextChange = (text: string) => {
    setJobDescriptionText(text);
    onValidationChange(text.trim().length > 0);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    // Simulate fetching and parsing the job description from URL
    const simulatedText = `Job Description fetched from ${urlInput}\n\nPosition: Senior Software Engineer\n\nRequirements:\n- 5+ years of experience with React, Next.js, and TypeScript.\n- Experience building accessible user interfaces and custom design systems.\n- Strong understanding of state management, routing, and RESTful/GraphQL APIs.\n- Excellent communication skills and teamwork alignment.\n\nNice to have:\n- Node.js, Python, and cloud services (AWS/GCP) experience.\n- Familiarity with CI/CD pipelines and unit testing frameworks.`;

    setJobDescriptionText(simulatedText);
    onValidationChange(true);
  };

  return (
    <div className="space-y-4">
      {/* Segmented Tab Controls */}
      <div className="flex border border-[#ddc0bd] rounded-lg p-1 bg-[#fff8ee]/60">
        <button
          type="button"
          onClick={() => handleTabChange('paste')}
          className={`flex-1 py-2 font-['Hanken_Grotesk'] text-[12px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1.5 ${
            tab === 'paste'
              ? 'bg-[#7a1f1f] text-white shadow-sm'
              : 'text-[#564240] hover:bg-[#fff0ed]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          Paste Text
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('url')}
          className={`flex-1 py-2 font-['Hanken_Grotesk'] text-[12px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1.5 ${
            tab === 'url'
              ? 'bg-[#7a1f1f] text-white shadow-sm'
              : 'text-[#564240] hover:bg-[#fff0ed]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
          Job URL
        </button>
      </div>

      {/* View Panel */}
      <div className="min-h-[220px]">
        {tab === 'paste' && (
          <div className="relative">
            <textarea
              value={jobDescriptionText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste the target job description details here..."
              rows={8}
              className="w-full p-4 bg-white/60 border border-[#ddc0bd] rounded-xl font-['Hanken_Grotesk'] text-[13px] text-[#2b1611] focus:outline-none focus:border-[#7a1f1f] focus:ring-1 focus:ring-[#7a1f1f] placeholder-[#564240]/40 resize-none h-[220px]"
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-[#564240]/50 font-['Hanken_Grotesk']">
              {jobDescriptionText.length} characters
            </div>
          </div>
        )}

        {tab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="job-url"
                className="block font-['Hanken_Grotesk'] text-[11px] font-bold text-[#564240]/60 uppercase tracking-wider"
              >
                Target Job Posting URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="job-url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://careers.company.com/jobs/senior-software-engineer"
                  className="flex-1 px-4 py-2.5 bg-white/60 border border-[#ddc0bd] rounded-lg font-['Hanken_Grotesk'] text-[13px] text-[#2b1611] focus:outline-none focus:border-[#7a1f1f]"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-5 bg-[#7a1f1f] hover:bg-[#5b060c] disabled:opacity-50 text-white font-['Hanken_Grotesk'] text-[12px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Fetch
                </button>
              </div>
            </div>

            {jobDescriptionText ? (
              <div className="p-4 bg-[#fff0ed]/40 border border-[#ddc0bd]/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#7a1f1f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    Successfully Imported JD
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setJobDescriptionText('');
                      setUrlInput('');
                      onValidationChange(false);
                    }}
                    className="text-[#ba1a1a] font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                  {jobDescriptionText}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#ddc0bd] rounded-xl p-8 text-center text-[#564240]/60 font-['Hanken_Grotesk'] text-[12px] flex flex-col items-center justify-center min-h-[140px]">
                <span className="material-symbols-outlined text-[#7a1f1f] text-[28px] mb-2 opacity-65">
                  link
                </span>
                Enter a job posting URL and click Fetch to automatically extract the job
                requirements.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
