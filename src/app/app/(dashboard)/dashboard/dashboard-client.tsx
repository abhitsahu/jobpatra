'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumes, useResumePreview } from '@/app/app/_hooks/use-resumes';
import { useSubscriptionStatus } from '@/app/app/_hooks/use-subscription';
import { ResumeCard } from '@/app/app/_components/features/dashboard/resume-card';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import Link from 'next/link';
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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title-asc' | 'title-desc'>('updated');
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);

  const { data, isLoading, isError } = useResumes({ limit: 20 });
  const { data: subData, isLoading: isSubLoading } = useSubscriptionStatus();

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
            {/* Widget 1: Plan & Usage Summary (col-span-12 lg:col-span-8) */}
            <div className="col-span-12 lg:col-span-8 bg-[#FFF8EE] border border-[#E5D9C8] shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c]">
                    Workshop Plan & Usage
                  </h3>
                  <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240]">
                    Current account limits and consumption
                  </p>
                </div>
                {isSubLoading ? (
                  <Skeleton className="h-6 w-24 rounded-none" />
                ) : (
                  <div className={`font-['Hanken_Grotesk'] text-[11px] font-bold uppercase tracking-wider px-3 py-1 border ${
                    (subData?.subscription?.plan ?? 'FREE') === 'FREE' 
                      ? 'bg-[#fff8c4] border-[#d8be75] text-[#745a1c]' 
                      : 'bg-[#fff0ed] border-[#ddc0bd]/40 text-[#5b060c]'
                  }`}>
                    {subData?.subscription?.planName || 'Free Plan'}
                  </div>
                )}

              </div>

              {isSubLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-[#fff0ed] animate-pulse rounded-none" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Resumes Usage */}
                  <div>
                    <div className="flex justify-between text-[12px] font-['Hanken_Grotesk'] font-semibold text-[#564240] mb-1">
                      <span>Resumes Created</span>
                      <span>
                        {subData?.usage?.resumes?.current ?? resumes.length} /{' '}
                        {subData?.usage?.resumes?.max === -1 ? '∞' : (subData?.usage?.resumes?.max ?? 3)}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3eae1] h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#5b060c] h-full transition-all duration-500"
                        style={{ width: `${subData?.usage?.resumes?.percent ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* ATS Scans Usage */}
                  <div>
                    <div className="flex justify-between text-[12px] font-['Hanken_Grotesk'] font-semibold text-[#564240] mb-1">
                      <span>ATS Analyses</span>
                      <span>
                        {subData?.usage?.atsScans?.current ?? 0} /{' '}
                        {subData?.usage?.atsScans?.max === -1 ? '∞' : (subData?.usage?.atsScans?.max ?? 5)}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3eae1] h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#795900] h-full transition-all duration-500"
                        style={{ width: `${subData?.usage?.atsScans?.percent ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Suggestions Usage */}
                  <div>
                    <div className="flex justify-between text-[12px] font-['Hanken_Grotesk'] font-semibold text-[#564240] mb-1">
                      <span>AI Suggestions Used</span>
                      <span>
                        {subData?.usage?.aiOptimizations?.current ?? 0} /{' '}
                        {subData?.usage?.aiOptimizations?.max === -1 ? '∞' : (subData?.usage?.aiOptimizations?.max ?? 10)}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3eae1] h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#1b5e20] h-full transition-all duration-500"
                        style={{ width: `${subData?.usage?.aiOptimizations?.percent ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* PDF Downloads Usage */}
                  <div>
                    <div className="flex justify-between text-[12px] font-['Hanken_Grotesk'] font-semibold text-[#564240] mb-1">
                      <span>PDF Exports</span>
                      <span>
                        {subData?.usage?.pdfDownloads?.current ?? 0} /{' '}
                        {subData?.usage?.pdfDownloads?.max === -1 ? '∞' : (subData?.usage?.pdfDownloads?.max ?? 5)}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3eae1] h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#564240] h-full transition-all duration-500"
                        style={{ width: `${subData?.usage?.pdfDownloads?.percent ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Widget 2: Quick Stats (col-span-12 lg:col-span-4) */}
            <div className="col-span-12 lg:col-span-4 bg-[#FFF8EE] border border-[#E5D9C8] shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#5b060c] mb-1">
                  Workshop Stats
                </h3>
                <p className="font-['Hanken_Grotesk'] text-[12px] text-[#564240] mb-4">
                  Overview of your document folder
                </p>
              </div>

              <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center border-b border-[#ddc0bd]/30 pb-2">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240]">Total Resumes</span>
                  <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#5b060c]">{resumes.length}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#ddc0bd]/30 pb-2">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240]">Completed</span>
                  <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#1b5e20]">
                    {resumes.filter(r => r.status === 'COMPLETE' || r.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#ddc0bd]/30 pb-2">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240]">Drafts</span>
                  <span className="font-['Playfair_Display'] text-[18px] font-bold text-[#795900]">
                    {resumes.filter(r => r.status !== 'COMPLETE' && r.status !== 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#564240]">Last Edited</span>
                  <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#5b060c]">
                    {resumes.length > 0 
                      ? new Date(resumes[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never'}
                  </span>
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
                  <Link
                    id="create-resume-btn"
                    href="/app/resume/new"
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold tracking-wider uppercase hover:bg-[#7a1f1f] transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Document
                  </Link>
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
                    <Link
                      href="/app/resume/new"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5b060c] text-white font-['Hanken_Grotesk'] text-[13px] font-semibold uppercase tracking-wider hover:bg-[#7a1f1f] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Create First Document
                    </Link>
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
          </div>
        </div>
      </div>

      {/* Reusable Footer Component */}
      <LandingFooter />

      {/* Quick Preview dialog */}
      {previewResumeId && (
        <QuickPreviewDialog resumeId={previewResumeId} onClose={() => setPreviewResumeId(null)} />
      )}
    </div>
  );
}
