'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumes, useResumePreview } from '@/app/app/_hooks/use-resumes';
import { StatCard } from '@/app/app/_components/features/dashboard/stat-card';
import { StatCardSkeleton } from '@/app/app/_components/features/dashboard/stat-card-skeleton';
import { ResumeCard } from '@/app/app/_components/features/dashboard/resume-card';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { CreateResumeDialog } from '@/app/app/_components/features/dashboard/create-resume-dialog';

// Quick Preview Modal Component
function QuickPreviewDialog({ resumeId, onClose }: { resumeId: string; onClose: () => void }) {
  const { data: html, isLoading } = useResumePreview(resumeId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[85vh] bg-surface-container border border-glass-border rounded-2xl p-6 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between pb-4 border-b border-glass-border mb-4">
          <h3 className="text-lg font-bold text-white font-[Space_Grotesk]">
            Resume Quick Preview
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-on-surface-variant transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>
        <div className="flex-1 bg-white rounded-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50">
              <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            </div>
          )}
          {html ? (
            <iframe srcDoc={html} className="w-full h-full border-none" title="Quick Preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-[#0b1014]">
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
    <div className="h-full overflow-y-auto relative">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-deep-indigo/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-electric-blue/10 blur-[100px] pointer-events-none z-0" />

      {/* Sticky header */}
      <header className="sticky top-0 z-20 h-20 flex items-center justify-between px-8 bg-surface-charcoal/80 backdrop-blur-xl border-b border-glass-border">
        <div>
          <h2 className="text-[24px] font-bold text-on-surface font-[Space_Grotesk]">
            Welcome back, {userName}.
          </h2>
          <p className="text-[14px] text-on-surface-variant mt-0.5">
            Here is what&apos;s happening with your job search today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-white transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full" />
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="p-8 z-10 relative space-y-6 pb-20 max-w-[1200px] mx-auto w-full">
        {/* Stat widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon="description"
                iconColor="text-electric-blue"
                label="Active Resumes"
                value={data?.total ?? 0}
                badge={`${resumes.length} total`}
              />
              <StatCard
                icon="analytics"
                iconColor="text-neon-purple"
                label="ATS Scans Used"
                value={8}
                badge="15 total allowed"
                progress={53}
              />
              <StatCard
                icon="verified"
                iconColor="text-primary"
                label="Current Plan"
                value="Pro"
                badge="Active"
                accentColor="#2E358A"
              />
            </>
          )}
        </div>

        {/* Resume list */}
        <div className="glass-panel rounded-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-[22px] font-semibold text-white font-[Space_Grotesk]">
              Recent Resumes
            </h3>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  id="dashboard-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resumes..."
                  className="bg-surface-container-low border border-glass-border rounded-full pl-9 pr-4 py-2 text-[13px] text-on-surface focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all w-48"
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
                  className="bg-surface-container-low border border-glass-border rounded-full px-4 py-2 text-[13px] text-on-surface focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all appearance-none pr-8 cursor-pointer"
                >
                  <option value="updated">Last Updated</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>

              {/* Create */}
              <button
                id="create-resume-btn"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-deep-indigo to-electric-blue text-white text-[14px] font-medium shadow-[0_0_15px_rgba(26,145,240,0.2)] hover:shadow-[0_0_25px_rgba(26,145,240,0.4)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Resume
              </button>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[72px] rounded-lg" />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-error block mb-3">
                error_outline
              </span>
              <p className="text-on-surface-variant text-[15px]">
                Failed to load resumes. Please refresh.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && sorted.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 block mb-4">
                description
              </span>
              <p className="text-[16px] text-on-surface-variant mb-6">
                {search ? 'No resumes match your search.' : "You don't have any resumes yet."}
              </p>
              {!search && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-deep-indigo to-electric-blue text-white text-[14px] font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Create your first resume
                </button>
              )}
            </motion.div>
          )}

          {/* Resume list */}
          {!isLoading && !isError && sorted.length > 0 && (
            <AnimatePresence>
              <div className="space-y-3">
                {sorted.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} onPreview={setPreviewResumeId} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Create dialog */}
      {showCreate && <CreateResumeDialog onClose={() => setShowCreate(false)} />}

      {/* Quick Preview dialog */}
      {previewResumeId && (
        <QuickPreviewDialog resumeId={previewResumeId} onClose={() => setPreviewResumeId(null)} />
      )}
    </div>
  );
}
