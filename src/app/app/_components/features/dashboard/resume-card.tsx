'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDuplicateResume, useDeleteResume, useDownloadPdf } from '@/app/app/_hooks/use-resumes';
import type { ResumeListItem } from '@/app/api/model/response/resume';

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

  // Tab indicator color based on completion status
  const tabColorClass = resume.status === 'COMPLETE' ? 'bg-[#5b060c]' : 'bg-[#8a716f]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col sm:flex-row sm:items-center p-6 hover:bg-[#fff0ed]/45 transition-colors border-b border-[#ddc0bd]/30 relative cursor-pointer"
      onClick={handleEdit}
    >
      {/* Folder Tab Indicator */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${tabColorClass} group-hover:w-3.5 transition-all duration-300`}
      ></div>

      <div className="flex-1 flex items-center min-w-0">
        <div className="w-14 h-16 bg-white border border-[#ddc0bd]/60 rounded-sm shadow-sm flex items-center justify-center mr-5 flex-shrink-0">
          <span className="material-symbols-outlined text-[#5b060c]/40 text-2xl">description</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-['Playfair_Display'] text-[18px] font-semibold text-[#5b060c] truncate group-hover:underline">
            {resume.title}
          </h4>
          <p className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] text-[#564240]/80 mt-1">
            Template: {resume.templateId} • Edited {formatDate(resume.updatedAt)} • Status:{' '}
            {resume.status}
          </p>
        </div>
      </div>

      {/* Flat Action Buttons appearing on hover */}
      <div
        className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity px-6 mt-4 sm:mt-0 relative z-30"
        onClick={(e) => e.stopPropagation()} // prevent card navigation when calling actions
      >
        <button
          onClick={handleEdit}
          className="p-2 hover:bg-[#ffe2db] text-[#564240] hover:text-[#5b060c] rounded transition-colors"
          title="Edit Resume"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          onClick={handlePreview}
          className="p-2 hover:bg-[#ffe2db] text-[#564240] hover:text-[#5b060c] rounded transition-colors"
          title="Quick Preview"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
        <button
          onClick={handleDuplicate}
          className="p-2 hover:bg-[#ffe2db] text-[#564240] hover:text-[#5b060c] rounded transition-colors"
          title="Duplicate"
        >
          <span className="material-symbols-outlined text-[20px]">content_copy</span>
        </button>
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-[#ffe2db] text-[#564240] hover:text-[#5b060c] rounded transition-colors"
          title="Download PDF"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
        </button>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-50 text-[#564240] hover:text-red-600 rounded transition-colors"
          title="Delete"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </motion.div>
  );
}
