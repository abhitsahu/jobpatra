'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface AtsPageClientProps {
  isLoggedIn: boolean;
}

export function AtsPageClient({ isLoggedIn }: AtsPageClientProps) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Authentication behaviour for public page actions
  const handleCTA = () => {
    if (isLoggedIn) {
      router.push('/app/ats-workspace');
    } else {
      router.push('/app/signup');
    }
  };

  // Count up ATS Score on load
  useEffect(() => {
    let start = 0;
    const end = 88;
    const duration = 1500;
    const incrementTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  // Parallax desk feel
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
      setMousePos({ x: moveX, y: moveY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#fff8f6] text-[#2b1611] font-['Hanken_Grotesk'] min-h-screen overflow-x-hidden relative selection:bg-[#5b060c]/20 selection:text-[#5b060c]">
      {/* Tactile Paper Texture Overlay */}
      <div className="fixed inset-0 auth-paper-texture pointer-events-none z-50"></div>

      {/* Main Workspace (The "Desk") */}
      <main
        ref={sectionRef}
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        className="max-w-7xl mx-auto px-4 md:px-16 py-12 flex flex-col lg:flex-row gap-8 transition-transform duration-300 ease-out"
      >
        {/* Left Column: The Archival Report (Sheet 1) */}
        <section className="flex-1">
          <div className="bg-[#fff8f6] border border-[#ddc0bd] shadow-sm relative overflow-hidden max-w-[800px] mx-auto p-8 md:p-12">
            {/* Watermark / Wax Seal Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[400px]">verified</span>
            </div>

            {/* Report Header */}
            <div className="flex justify-between items-start border-b-2 border-[#5b060c] pb-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="material-symbols-outlined text-[#5b060c]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    description
                  </span>
                  <span className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-[#5b060c] uppercase">
                    Official Dossier
                  </span>
                </div>
                <h1 className="font-['Playfair_Display'] text-[32px] md:text-[40px] leading-tight font-bold text-[#2b1611] mb-1">
                  ATS Compatibility Audit
                </h1>
                <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240] italic">
                  Report ID: #JP-8829-ARCHIVAL
                </p>
              </div>

              {/* Score as a Postage Stamp */}
              <div className="relative w-32 h-40 bg-[#ffdad2] border-2 border-[#ffb3ae] flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                <div className="absolute -top-1 -left-1 w-full h-full border border-[#5b060c] opacity-20 pointer-events-none"></div>
                <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#795900] uppercase tracking-tighter mb-1">
                  Passage Rate
                </span>
                <div className="font-['Playfair_Display'] text-[32px] leading-[40px] text-[#5b060c] font-bold">
                  {score}
                  <span className="text-[20px]">%</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-[10px] text-[#8a716f] font-bold border-2 border-[#8a716f] px-1.5 py-0.5 rounded transform rotate-12 uppercase tracking-wider">
                    VALIDATED
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                    Priority Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Summary Section */}
            <div className="mb-12">
              <h2 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#2b1611] border-b border-[#ddc0bd] mb-4 pb-2">
                I. Executive Summary & Compatibility Score
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[16px] md:text-[18px] text-[#2b1611] leading-relaxed mb-6">
                The submitted document has been analyzed against the{' '}
                <span className="text-[#5b060c] font-bold">Standard HR Index</span>. We have
                identified strong alignment with industry keywords, though architectural formatting
                requires minor recalibration for optimal machine parsing. Let us check details
                below:
              </p>

              {/* Key Findings Bento Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#fff0ed] border border-[#ddc0bd] rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#5b060c]">history_edu</span>
                    <span className="font-['Hanken_Grotesk'] text-[14px] font-semibold text-[#5b060c] uppercase tracking-wider">
                      Content Quality & Readability
                    </span>
                  </div>
                  <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] text-[#564240]">
                    Strong use of action verbs and measurable achievements. Alignment with
                    &apos;Senior Lead&apos; roles is high. Readability metrics are inside the top
                    10%.
                  </p>
                </div>
                <div className="p-6 bg-[#fff0ed] border border-[#ddc0bd] rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[#5b060c]">architecture</span>
                    <span className="font-['Hanken_Grotesk'] text-[14px] font-semibold text-[#5b060c] uppercase tracking-wider">
                      Parsing Logic & Structure
                    </span>
                  </div>
                  <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] text-[#564240]">
                    Multi-column layouts detected. Warning: Some legacy parsers may struggle with
                    the left sidebar. Section completeness is currently at 78%.
                  </p>
                </div>
              </div>
            </div>

            {/* Keyword Match List (Ledger Style) */}
            <div className="mb-12">
              <h2 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#2b1611] border-b border-[#ddc0bd] mb-6 pb-2">
                II. Keyword Lexicon & Professional Summary Analysis
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-end pb-2 border-b border-[#ddc0bd]">
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[#795900]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[16px] text-[#2b1611]">
                      Strategic Leadership & Action Verbs
                    </span>
                  </div>
                  <span className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] italic">
                    High Match
                  </span>
                </div>
                <div className="flex justify-between items-end pb-2 border-b border-[#ddc0bd]">
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[#795900]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[16px] text-[#2b1611]">
                      SaaS Architecture & Grammar Integrity
                    </span>
                  </div>
                  <span className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] italic">
                    High Match
                  </span>
                </div>
                <div className="flex justify-between items-end pb-2 border-b border-[#ddc0bd]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
                    <span className="font-['Hanken_Grotesk'] text-[16px] text-[#564240]">
                      Product Lifecycle Management
                    </span>
                  </div>
                  <span className="font-['Hanken_Grotesk'] text-[12px] text-[#ba1a1a] italic font-semibold">
                    Missing
                  </span>
                </div>
                <div className="flex justify-between items-end pb-2 border-b border-[#ddc0bd]">
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[#795900]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[16px] text-[#2b1611]">
                      Agile Methodology & Team Metrics
                    </span>
                  </div>
                  <span className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] italic">
                    Found (3x)
                  </span>
                </div>
              </div>
            </div>

            {/* Formatting Signature */}
            <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="max-w-xs">
                <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] mb-4">
                  Certified by JobPatra AI Evaluation Engine. This document represents a
                  point-in-time compatibility assessment.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleCTA}
                    className="bg-[#795900] text-white px-4 py-2 font-['Hanken_Grotesk'] text-[14px] font-semibold flex items-center gap-2 shadow-sm hover:translate-y-[-1px] transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">download</span> Export PDF
                  </button>
                  <button
                    onClick={handleCTA}
                    className="border border-[#8a716f] text-[#2b1611] px-4 py-2 font-['Hanken_Grotesk'] text-[14px] font-semibold hover:bg-[#fff0ed] transition-colors"
                  >
                    Re-Scan
                  </button>
                </div>
              </div>
              <div className="text-right self-end">
                <div className="font-['Playfair_Display'] text-[#5b060c] text-3xl italic mb-1">
                  JobPatra AI
                </div>
                <div className="w-48 h-[1px] bg-[#8a716f] ml-auto mb-1"></div>
                <div className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                  Evaluation Seal of Authenticity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: The Resume Preview (Sheet 2 - "Pinned") */}
        <aside className="w-full lg:w-[420px] sticky top-28 h-fit">
          <div className="relative bg-[#FFF8EE] border border-[#E5D9C8] p-10 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* The Paperclips */}
            <div className="absolute top-[-12px] right-20 w-8 h-16 border-3 border-[#8a716f] border-t-0 rounded-b-2xl opacity-60 z-20"></div>
            <div className="absolute top-[-12px] right-8 w-8 h-16 border-3 border-[#8a716f] border-t-0 rounded-b-2xl opacity-60 z-20"></div>

            {/* AI Signature Nib Icon */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b060c] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#fff8f6] z-30">
              <span className="material-symbols-outlined">edit_note</span>
            </div>

            <div className="space-y-6 opacity-80 pointer-events-none">
              <div className="border-b-2 border-[#ddc0bd] pb-4">
                <div className="w-32 h-6 bg-[#f9d1c8] rounded mb-2"></div>
                <div className="w-48 h-3 bg-[#ffe2db] rounded mb-4"></div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-[#ffdad2] rounded"></div>
                <div className="w-[90%] h-3 bg-[#ffdad2] rounded"></div>
                <div className="w-full h-3 bg-[#ffdad2] rounded"></div>
                <div className="w-[70%] h-3 bg-[#ffdad2] rounded"></div>
              </div>

              {/* AI Highlighted Section */}
              <div className="relative p-4 bg-[#ffdad5] rounded border-l-4 border-[#ba1a1a]">
                <div className="absolute -top-2 -right-2 bg-[#5b060c] text-white p-1 rounded-sm">
                  <span className="material-symbols-outlined text-xs">ink_pen</span>
                </div>
                <div className="w-full h-3 bg-[#ffb4a9]/30 rounded mb-2"></div>
                <div className="w-[80%] h-3 bg-[#ffb4a9]/30 rounded"></div>
                <p className="mt-3 font-['Hanken_Grotesk'] text-[12px] text-[#5e0001] italic leading-tight">
                  AI Suggestion: Quantify your results here for better parsing.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#ddc0bd]">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-2 bg-[#f9d1c8] rounded"></div>
                    <div className="w-full h-2 bg-[#f9d1c8] rounded"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-2 bg-[#f9d1c8] rounded"></div>
                    <div className="w-full h-2 bg-[#f9d1c8] rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center">
              <div className="text-[#8a716f] font-['Hanken_Grotesk'] text-[12px] font-bold tracking-wider uppercase mb-2">
                SCANNED PREVIEW
              </div>
              <button
                onClick={handleCTA}
                className="bg-[#7a1f1f] text-white w-full py-3 font-['Hanken_Grotesk'] text-[14px] font-semibold uppercase tracking-wider hover:bg-[#5b060c] transition-all"
              >
                Edit This Document
              </button>
            </div>
          </div>

          {/* Contextual Tip (Small Post-it style) */}
          <div className="mt-8 bg-[#ffdfa0] p-6 shadow-md border-b-4 border-[#795900]/20 relative -rotate-1">
            <span className="material-symbols-outlined text-[#795900] absolute top-4 right-4 text-2xl">
              lightbulb
            </span>
            <h4 className="font-['Hanken_Grotesk'] text-[14px] font-bold text-[#795900] uppercase mb-2">
              Pro Tip
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] leading-relaxed text-[#261a00]">
              Remove graphical elements like bars or charts. ATS systems prioritize plain text
              readability over visual flair.
            </p>
          </div>
        </aside>
      </main>

      {/* Feature Explanations Section */}
      <section className="bg-white border-y border-[#ddc0bd] py-20 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-['Playfair_Display'] text-[36px] md:text-[44px] font-bold text-[#5b060c] mb-4">
              Decipher the ATS Gatekeeper
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[16px] md:text-[18px] text-[#564240]">
              JobPatra AI dissects your document using the same parsing parameters utilized by major
              enterprise recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#5b060c] mb-4">
                analytics
              </span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                ATS Score
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Understand how recruitment screening algorithms rate your resume instantly. Get
                actionable benchmarks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#795900] mb-4">key</span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                Keyword Matching
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Compare your resume skillset directly against standard target descriptions to
                discover gaps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#ba1a1a] mb-4">
                architecture
              </span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                Formatting Analysis
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Detect formatting issues (tables, charts, layout bars) that prevent machine parsers
                from reading you.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#5b060c] mb-4">
                edit_note
              </span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                AI Suggestions
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Receive intelligent sentence-by-sentence recommendations to improve your resume
                wording.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#795900] mb-4">
                search
              </span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                Resume Parsing
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Verify exactly how an ATS extracts text and maps your headings. Ensure everything
                reads smoothly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[36px] text-[#ba1a1a] mb-4">
                workspace_premium
              </span>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#2b1611] mb-3">
                Industry Benchmark
              </h3>
              <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240]">
                Compare your parameters against successful candidates to target elite modern tech
                positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-['Playfair_Display'] text-[36px] md:text-[44px] font-bold text-[#5b060c] mb-4">
            The Audit Workflow
          </h2>
          <p className="font-['Hanken_Grotesk'] text-[16px] text-[#564240]">
            From upload to landing your interview, our automated workshop optimizes your resume
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#5b060c] text-white font-['Playfair_Display'] font-bold rounded-full flex items-center justify-center text-lg mb-4 shadow-md">
              1
            </div>
            <h4 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
              Upload Resume
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240]">
              Securely import your document into our private archival space.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#795900] text-white font-['Playfair_Display'] font-bold rounded-full flex items-center justify-center text-lg mb-4 shadow-md">
              2
            </div>
            <h4 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
              AI Analysis
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240]">
              Automated parsers examine lexicon structure and layout rules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#5b060c] text-white font-['Playfair_Display'] font-bold rounded-full flex items-center justify-center text-lg mb-4 shadow-md">
              3
            </div>
            <h4 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
              ATS Report
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240]">
              Get your Passage Rate, formatting scores, and keyword maps.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#795900] text-white font-['Playfair_Display'] font-bold rounded-full flex items-center justify-center text-lg mb-4 shadow-md">
              4
            </div>
            <h4 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
              AI Suggestions
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240]">
              Edit and apply suggested upgrades dynamically inside our builder.
            </p>
          </div>

          {/* Step 5 */}
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#1B5E20] text-white font-['Playfair_Display'] font-bold rounded-full flex items-center justify-center text-lg mb-4 shadow-md">
              5
            </div>
            <h4 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611] mb-2">
              Download Improved Resume
            </h4>
            <p className="font-['Hanken_Grotesk'] text-[14px] text-[#564240]">
              Download your verified, high-scoring ATS-compatible PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="bg-[#fff0ed] border-y border-[#ddc0bd] py-20 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-['Playfair_Display'] text-[36px] md:text-[44px] font-bold text-[#5b060c] mb-4">
              Real-World Recalibration
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[16px] text-[#564240]">
              See how minor refinements to keyword layout and formatting transform your ATS profile
              score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Before */}
            <div className="bg-[#FFF8EE] border border-[#ddc0bd]/80 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#ba1a1a] uppercase tracking-wider block mb-4">
                  Original Document
                </span>
                <div className="flex justify-between items-center pb-4 border-b border-[#ddc0bd]/30 mb-6">
                  <h4 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c]">
                    Generic Layout
                  </h4>
                  <span className="text-[20px] font-bold text-[#ba1a1a] bg-red-100/50 px-2 py-0.5 border border-red-200">
                    54% Score
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                      close
                    </span>
                    Unreadable multi-column formatting and visual tables.
                  </li>
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                      close
                    </span>
                    Missing key terminologies matching SaaS & leadership roles.
                  </li>
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                      close
                    </span>
                    Vague work summaries devoid of metrics.
                  </li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 border border-[#ba1a1a] text-[#ba1a1a] hover:bg-red-50 py-2.5 font-['Hanken_Grotesk'] text-[13px] font-bold uppercase tracking-wider"
              >
                Scan Original
              </button>
            </div>

            {/* After */}
            <div className="bg-[#FFF8EE] border border-[#5b060c] p-8 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#5b060c] text-white flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <div>
                <span className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#1B5E20] uppercase tracking-wider block mb-4">
                  JobPatra Optimized
                </span>
                <div className="flex justify-between items-center pb-4 border-b border-[#ddc0bd]/30 mb-6">
                  <h4 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c]">
                    Archival Clean Layout
                  </h4>
                  <span className="text-[20px] font-bold text-[#1B5E20] bg-green-100/50 px-2 py-0.5 border border-green-200">
                    94% Score
                  </span>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#1B5E20] text-[18px]">
                      check
                    </span>
                    Clean parsing logic with robust linear readability.
                  </li>
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#1B5E20] text-[18px]">
                      check
                    </span>
                    Laced with target key action terms.
                  </li>
                  <li className="flex items-start gap-2 text-[#564240] text-[14px]">
                    <span className="material-symbols-outlined text-[#1B5E20] text-[18px]">
                      check
                    </span>
                    Refined metrics showcasing verified impact.
                  </li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 bg-[#5b060c] text-white hover:bg-[#7a1f1f] py-2.5 font-['Hanken_Grotesk'] text-[13px] font-bold uppercase tracking-wider"
              >
                Apply Improvements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-['Playfair_Display'] text-[36px] md:text-[44px] font-bold text-[#5b060c] mb-4">
            Workshop Endorsements
          </h2>
          <p className="font-['Hanken_Grotesk'] text-[16px] text-[#564240]">
            How modern professionals bypassed traditional digital gatekeepers using our archival
            audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] relative">
            <span className="material-symbols-outlined text-4xl text-[#5b060c] mb-4">
              format_quote
            </span>
            <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240] mb-6">
              &ldquo;My original resume was scoring 48% on ATS checkers due to complex column
              tables. JobPatra helped me redesign it to a clean single-column structure, instantly
              rising my response rates.&rdquo;
            </p>
            <div className="border-t border-[#ddc0bd]/40 pt-4">
              <h5 className="font-['Playfair_Display'] font-bold text-[#2b1611]">Sarah Jenkins</h5>
              <p className="font-['Hanken_Grotesk'] text-[12px] text-[#8a716f]">
                VP of Marketing, SaaS Corp
              </p>
            </div>
          </div>

          <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] relative">
            <span className="material-symbols-outlined text-4xl text-[#795900] mb-4">
              format_quote
            </span>
            <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240] mb-6">
              &ldquo;The keyword lexicon matching is incredibly accurate. It highlighted three major
              missing technologies that I actually knew but forgot to detail. Re-scanned and got
              responses in a week.&rdquo;
            </p>
            <div className="border-t border-[#ddc0bd]/40 pt-4">
              <h5 className="font-['Playfair_Display'] font-bold text-[#2b1611]">
                Marcus Thompson
              </h5>
              <p className="font-['Hanken_Grotesk'] text-[12px] text-[#8a716f]">
                Lead Solutions Engineer
              </p>
            </div>
          </div>

          <div className="p-8 bg-[#fff8f6] border border-[#ddc0bd] relative">
            <span className="material-symbols-outlined text-4xl text-[#ba1a1a] mb-4">
              format_quote
            </span>
            <p className="font-['Hanken_Grotesk'] text-[15px] leading-relaxed text-[#564240] mb-6">
              &ldquo;I thought my graphic resume looked stunning, but recruiters&apos; software was
              reading it as gibberish. JobPatra&apos;s audit forced me to focus on text priority.
              Highly recommend the Pro plan.&rdquo;
            </p>
            <div className="border-t border-[#ddc0bd]/40 pt-4">
              <h5 className="font-['Playfair_Display'] font-bold text-[#2b1611]">David Chen</h5>
              <p className="font-['Hanken_Grotesk'] text-[12px] text-[#8a716f]">
                Creative Director
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5b060c] text-white py-16 px-4 md:px-16 text-center relative overflow-hidden">
        {/* Paper clip detail graphic */}
        <div className="absolute top-0 right-20 w-8 h-24 bg-[#D1C4B1]/30 rounded-b-full border-x-4 border-b-4 border-white/20 hidden md:block"></div>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-[36px] md:text-[48px] font-bold mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="font-['Hanken_Grotesk'] text-[16px] md:text-[18px] text-white/90 mb-8 max-w-2xl mx-auto">
            Analyze your resume parameters against standard HR logic. Build a document recruiters
            can parse.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCTA}
              className="bg-[#FFF8EE] text-[#5b060c] hover:bg-white px-8 py-3.5 font-['Hanken_Grotesk'] text-[14px] font-semibold uppercase tracking-wider shadow-md transition-all"
            >
              Analyze Resume
            </button>
            <button
              onClick={handleCTA}
              className="border-2 border-white hover:bg-white/10 px-8 py-3.5 font-['Hanken_Grotesk'] text-[14px] font-semibold uppercase tracking-wider transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
