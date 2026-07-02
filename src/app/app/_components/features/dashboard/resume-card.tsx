'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDuplicateResume, useDeleteResume, useDownloadPdf } from '@/app/app/_hooks/use-resumes';
import type { ResumeListItem } from '@/app/api/model/response/resume';
import { cn } from '@/app/app/_util/cn';

interface ResumeCardProps {
  resume: ResumeListItem;
  onPreview: (id: string) => void;
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffHrs < 1) return 'just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays}d ago`;
}

export function ResumeCard({ resume, onPreview }: ResumeCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const duplicate = useDuplicateResume();
  const del = useDeleteResume();
  const pdf = useDownloadPdf();

  const handleEdit = () => router.push(`/app/resume/${resume.id}`);
  const handleDuplicate = () => duplicate.mutate(resume.id);
  const handleDelete = () => {
    if (window.confirm(`Delete "${resume.title}"? This cannot be undone.`)) {
      del.mutate(resume.id);
    }
  };
  const handleDownload = () => pdf.mutate({ id: resume.id, filename: `${resume.title}.pdf` });
  const handlePreview = () => onPreview(resume.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-lg bg-surface-container-lowest/50 border border-glass-border flex items-center justify-between hover:bg-surface-container-high transition-colors group cursor-pointer"
      onClick={handleEdit}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-electric-blue transition-colors shrink-0">
          <span className="material-symbols-outlined">description</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-[15px] font-medium text-white truncate max-w-[260px]">
            {resume.title}
          </h4>
          <p className="text-[13px] text-on-surface-variant mt-0.5">
            {resume.templateId} · Edited {formatDate(resume.updatedAt)}
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-4"
        onClick={(e) => e.stopPropagation()} // prevent card click when using action buttons
      >
        {/* Status badge */}
        <span
          className={cn(
            'text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full border hidden sm:block',
            resume.status === 'COMPLETE'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-surface-container-high text-on-surface-variant border-glass-border',
          )}
        >
          {resume.status}
        </span>

        {/* Actions */}
        <div className="relative">
          <button
            id={`resume-menu-${resume.id}`}
            className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-all"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Resume actions"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-10 z-50 w-48 bg-surface-container-high border border-glass-border rounded-xl shadow-2xl overflow-hidden"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {[
                  { label: 'Edit', icon: 'edit', action: handleEdit },
                  { label: 'Quick Preview', icon: 'visibility', action: handlePreview },
                  { label: 'Duplicate', icon: 'content_copy', action: handleDuplicate },
                  { label: 'Download PDF', icon: 'download', action: handleDownload },
                  { label: 'Delete', icon: 'delete', action: handleDelete, danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium hover:bg-white/5 transition-colors text-left',
                      item.danger ? 'text-error' : 'text-on-surface',
                    )}
                    onClick={() => {
                      setMenuOpen(false);
                      item.action();
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
