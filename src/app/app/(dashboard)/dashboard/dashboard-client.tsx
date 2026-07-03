'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumes, useResumePreview } from '@/app/app/_hooks/use-resumes';
import { ResumeCard } from '@/app/app/_components/features/dashboard/resume-card';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { CreateResumeDialog } from '@/app/app/_components/features/dashboard/create-resume-dialog';
import { LandingFooter } from '@/app/app/_components/landing/landing-footer';
import { LogoutButton } from './logout-button';

// Quick Preview Modal Component
function QuickPreviewDialog({ resumeId, onClose }: { resumeId: string; onClose: () => void }) {
  const { data: html, isLoading } = useResumePreview(resumeId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1611]/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[85vh] bg-[#FFF8EE] border border-[#ddc0bd] shadow-2xl flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between pb-4 border-b border-[#ddc0bd]/40 mb-4">
          <h3 className="text-xl font-bold text-[#5b060c] font-['Playfair_Display']">
            Document Archive Preview
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#ffe2db] text-[#564240] hover:text-[#5b060c] transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>
        <div className="flex-1 bg-white border border-[#ddc0bd]/50 rounded-sm overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-[#fff0ed]/40 backdrop-blur-[2px] flex items-center justify-center z-50">
              <div className="w-8 h-8 border-4 border-[#ddc0bd]/30 border-t-[#5b060c] rounded-full animate-spin" />
            </div>
          )}
          {html ? (
            <iframe srcDoc={html} className="w-full h-full border-none" title="Quick Preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#564240] bg-[#FFF8EE]">
              <span>No preview available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPageClient({ userName }: { userName: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title-asc' | 'title-desc'>('updated');
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);

  const { data, isLoading, isError } = useResumes({ limit: 20 });

  const resumes = data?.data ?? [];
  const filtered = resumes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="h-full overflow-y-auto relative flex flex-col justify-between">
      <div>
        {/* Top bar with Navigation Controls */}
        <div className="flex justify-end items-center gap-4 py-4 px-8 border-b border-[#ddc0bd]/30 bg-[#F8F2E8]/80 backdrop-blur-md sticky top-0 z-30">
          <button className="w-10 h-10 bg-white/40 border border-[#ddc0bd] flex items-center justify-center text-[#564240] hover:text-[#5b060c] transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#5b060c] rounded-full" />
          </button>
          <LogoutButton />
        </div>

        {/* Main Content Canvas */}
        <div className="p-8 md:p-16 relative z-10 max-w-7xl mx-auto w-full">
          {/* Floating Nib Ornament */}
          <div className="absolute top-8 right-12 opacity-5 pointer-events-none hidden lg:block">
            <span className="material-symbols-outlined text-[120px]">ink_pen</span>
          </div>

          {/* Header */}
          <header className="mb-12">
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] font-bold text-[#5b060c] leading-tight mb-2">
              Welcome back, {userName}
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[16px] md:text-[18px] text-[#564240]">
              Your professional legacy is currently being refined in the workshop.
            </p>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* ATS Score Widget (Postage Stamp) */}
            <div className="col-span-12 lg:col-span-4 bg-[#FFF8EE] border border-[#E5D9C8] shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-4 left-4 font-['Hanken_Grotesk'] text-[11px] font-semibold uppercase tracking-wider text-[#8a716f]">
                Postage Metric
              </div>

              {/* The Stamp Mark */}
              <div className="w-44 h-44 border-4 border-dashed border-[#5b060c]/20 rounded-full flex flex-col items-center justify-center relative p-4 rotate-[-5deg]">
                <div className="absolute inset-0 border-2 border-[#5b060c]/10 rounded-full m-2"></div>
                <span className="font-['Hanken_Grotesk'] text-[10px] font-semibold text-[#5b060c]/60 mb-1 tracking-widest">
                  ATS INDEX
                </span>
                <span className="font-['Playfair_Display'] text-[#5b060c] text-6xl font-bold">
                  94
                </span>
                <span className="font-['Hanken_Grotesk'] text-[10px] font-semibold text-[#5b060c]/60 mt-1 tracking-wider">
                  PERCENTILE
                </span>
                {/* Rubber Stamp Texture Overlay */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "url('https://www.transparenttextures.com/patterns/stardust.png')",
                  }}
                />
              </div>

              <div className="mt-6 text-center">
                <p className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] text-[#564240] italic font-medium">
                  &ldquo;Highly Optimized for Career Success&rdquo;
                </p>
              </div>
            </div>

            {/* Active Correspondences (Envelope Rack) */}
            <div className="col-span-12 lg:col-span-8 bg-[#FFF8EE] border border-[#E5D9C8] shadow-sm p-8 overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#5b060c] mb-1">
                    Active Correspondences
                  </h3>
                  <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240]">
                    Pending resume activities and metric benchmarks
                  </p>
                </div>
                <div className="font-['Hanken_Grotesk'] text-[12px] font-semibold uppercase tracking-wider text-[#5b060c] bg-[#fff0ed] px-3 py-1 border border-[#ddc0bd]/40">
                  {resumes.length} Document{resumes.length !== 1 ? 's' : ''} Archive
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Envelope 1 */}
                <div className="bg-white border border-[#E5D9C8] p-6 shadow-sm flex flex-col h-44 relative hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#5b060c] shadow-sm font-bold text-sm">
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </div>
                    <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-[#8a716f]">
                      2 Days Ago
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] font-bold text-[#5b060c]">
                      Executive Master
                    </h4>
                    <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                      Tailored Design Artifact
                    </p>
                  </div>
                </div>

                {/* Envelope 2 */}
                <div className="bg-white border border-[#E5D9C8] p-6 shadow-sm flex flex-col h-44 relative hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#795900] shadow-sm font-bold text-sm">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        schedule
                      </span>
                    </div>
                    <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-[#8a716f]">
                      In Review
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] font-bold text-[#5b060c]">
                      ATS Compliance
                    </h4>
                    <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                      Scan Ready Portfolio
                    </p>
                  </div>
                </div>

                {/* Envelope 3 */}
                <div className="bg-white border border-[#E5D9C8] p-6 shadow-sm flex flex-col h-44 relative hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#1B5E20] shadow-sm font-bold text-sm">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                    <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-[#8a716f]">
                      Elite tier
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] font-bold text-[#5b060c]">
                      Pro Account
                    </h4>
                    <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                      Signature License
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Resumes (Folder Tabs) */}
            <div className="col-span-12 bg-[#FFF8EE] border border-[#E5D9C8] shadow-sm p-0 overflow-hidden mt-6">
              <div className="p-8 border-b border-[#ddc0bd]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="font-['Playfair_Display'] text-[24px] font-bold text-[#5b060c]">
                    Resume Repository
                  </h3>
                  <p className="font-['Hanken_Grotesk'] text-[13px] text-[#564240] mt-1">
                    Manage and craft your professional documents
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#8a716f]">
                      search
                    </span>
                    <input
                      id="dashboard-search"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search archive..."
                      className="bg-white/60 border border-[#ddc0bd] pl-10 pr-4 py-2 font-['Hanken_Grotesk'] text-[13px] text-[#2b1611] placeholder-[#8a716f]/60 focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all w-full sm:w-48"
                    />
                  </div>

                  {/* Sort Selector */}
                  <div className="relative">
                    <select
                      id="dashboard-sort"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as 'updated' | 'title-asc' | 'title-desc')
                      }
                      className="bg-white/60 border border-[#ddc0bd] pl-4 pr-10 py-2 font-['Hanken_Grotesk'] text-[13px] text-[#2b1611] focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-all appearance-none cursor-pointer"
                    >
                      <option value="updated">Last Updated</option>
                      <option value="title-asc">Title (A-Z)</option>
                      <option value="title-desc">Title (Z-A)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8a716f] pointer-events-none">
                      keyboard_arrow_down
                    </span>
                  </div>

                  {/* Create */}
                  <button
                    id="create-resume-btn"
                    onClick={() => setShowCreate(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold tracking-wider uppercase hover:bg-[#7a1f1f] transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Document
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-20 bg-[#fff0ed] border border-[#ddc0bd]/20 rounded-none"
                    />
                  ))}
                </div>
              )}

              {/* Error state */}
              {isError && (
                <div className="text-center py-16 px-4">
                  <span className="material-symbols-outlined text-4xl text-red-700 block mb-3">
                    error_outline
                  </span>
                  <p className="font-['Hanken_Grotesk'] text-[#564240] text-[15px] font-medium">
                    Failed to load document repository. Please refresh.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !isError && sorted.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-4"
                >
                  <span className="material-symbols-outlined text-5xl text-[#8a716f]/40 block mb-4">
                    description
                  </span>
                  <p className="font-['Hanken_Grotesk'] text-[#564240] text-[15px] mb-6 font-medium">
                    {search
                      ? 'No documents match your filter query.'
                      : 'Your workshop repository is empty.'}
                  </p>
                  {!search && (
                    <button
                      onClick={() => setShowCreate(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider hover:bg-[#7a1f1f] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Create First Document
                    </button>
                  )}
                </motion.div>
              )}

              {/* Resume list */}
              {!isLoading && !isError && sorted.length > 0 && (
                <AnimatePresence>
                  <div className="flex flex-col">
                    {sorted.map((resume) => (
                      <ResumeCard key={resume.id} resume={resume} onPreview={setPreviewResumeId} />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Suggestion Card (AI Artifact) */}
            <div className="col-span-12 mt-6">
              <div className="bg-[#5b060c] text-white p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-md relative overflow-hidden">
                {/* Paper Clip Graphic */}
                <div className="absolute top-0 right-10 w-8 h-24 bg-[#D1C4B1]/30 rounded-b-full border-x-4 border-b-4 border-white/20 hidden md:block"></div>

                <div className="p-4 bg-white/10 rounded-full flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    ink_pen
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-['Playfair_Display'] text-[22px] font-bold mb-1">
                    AI Workshop Suggestion
                  </h3>
                  <p className="font-['Hanken_Grotesk'] text-[14px] leading-[22px] text-white/90 max-w-3xl">
                    Our analysis indicates that tailoring your Professional Summaries by focusing on
                    quantitative achievements increases employer engagement rates by up to 12%.
                    Apply improvements directly inside the builder page.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreate(true)}
                  className="bg-[#FFF8EE] text-[#5b060c] px-6 py-2.5 font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider hover:bg-white transition-all relative z-10"
                >
                  Apply Improvements
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Footer Component */}
      <LandingFooter />

      {/* Create dialog */}
      {showCreate && <CreateResumeDialog onClose={() => setShowCreate(false)} />}

      {/* Quick Preview dialog */}
      {previewResumeId && (
        <QuickPreviewDialog resumeId={previewResumeId} onClose={() => setPreviewResumeId(null)} />
      )}
    </div>
  );
}
