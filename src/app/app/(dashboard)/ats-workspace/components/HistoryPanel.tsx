'use client';

import { useRouter } from 'next/navigation';
import { useAtsHistory, useDeleteAtsAnalysis, useClearAtsHistory } from '@/app/app/_hooks/use-ats-history';

export function HistoryPanel() {
  const router = useRouter();
  const { data, isLoading } = useAtsHistory({ limit: 50 });
  const deleteMutation = useDeleteAtsAnalysis();
  const clearMutation = useClearAtsHistory();

  const analyses = data?.items ?? [];

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire analysis history?')) {
      clearMutation.mutate();
    }
  };

  return (
    <div className="bg-[#FFF8EE] border border-[#E5D9C8] rounded-2xl p-6 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5D9C8] mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7a1f1f] text-[22px]">history</span>
          <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2b1611]">
            Analysis History
          </h3>
        </div>
        {analyses.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearMutation.isPending}
            className="font-['Hanken_Grotesk'] text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider hover:underline disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin max-h-[480px]">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[#f5ece8] animate-pulse" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center text-[#564240]/60 font-['Hanken_Grotesk'] text-[13px] space-y-2">
            <span className="material-symbols-outlined text-[32px] text-[#7a1f1f]/50">
              analytics
            </span>
            <p>No previous analyses found.</p>
            <p className="text-[11px] text-[#564240]/40 max-w-[200px]">
              Complete an ATS analysis to build your history log.
            </p>
          </div>
        ) : (
          analyses.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/app/ats-workspace/result/${item.id}`)}
              className="group p-4 bg-white/60 border border-[#ddc0bd]/60 rounded-xl hover:border-[#7a1f1f] hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-['Hanken_Grotesk'] text-[13px] font-bold text-[#2b1611] truncate group-hover:text-[#7a1f1f]">
                  {item.resumeName || 'Untitled Resume'}
                </h4>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-[#564240]/80 truncate">
                  JD: {item.jobTitle || 'General Matching'}
                </p>
                <p className="font-['Hanken_Grotesk'] text-[9px] text-[#564240]/50 uppercase tracking-wider mt-1">
                  {new Date(item.analysisDate).toLocaleDateString()} at{' '}
                  {new Date(item.analysisDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`font-['Hanken_Grotesk'] text-[16px] font-black ${
                    item.overallScore >= 80
                      ? 'text-[#1B5E20]'
                      : item.overallScore >= 60
                        ? 'text-[#795900]'
                        : 'text-[#ba1a1a]'
                  }`}
                >
                  {item.overallScore}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  disabled={deleteMutation.isPending}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ffe4e4] text-[#ba1a1a] transition-all disabled:opacity-50"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
