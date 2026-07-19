'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SavedAnalysis {
  id: string;
  resumeTitle: string;
  jobTitle: string;
  overallScore: number;
  timestamp: string;
}

export function HistoryPanel() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jobpatra_ats_analyses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedAnalysis[];
        // Sort by timestamp desc
        parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnalyses(parsed);
      } catch (err) {
        console.error('Failed to parse saved analyses history', err);
      }
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = analyses.filter((a) => a.id !== id);
    setAnalyses(updated);
    localStorage.setItem('jobpatra_ats_analyses', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire analysis history?')) {
      setAnalyses([]);
      localStorage.removeItem('jobpatra_ats_analyses');
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
            className="font-['Hanken_Grotesk'] text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin max-h-[480px]">
        {analyses.length === 0 ? (
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
                  {item.resumeTitle || 'Untitled Resume'}
                </h4>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-[#564240]/80 truncate">
                  JD: {item.jobTitle || 'General Matching'}
                </p>
                <p className="font-['Hanken_Grotesk'] text-[9px] text-[#564240]/50 uppercase tracking-wider mt-1">
                  {new Date(item.timestamp).toLocaleDateString()} at{' '}
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Score badge */}
                <div
                  className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-['Playfair_Display'] text-[14px] font-bold border ${
                    item.overallScore >= 80
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : item.overallScore >= 60
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {item.overallScore}%
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="w-8 h-8 rounded-full hover:bg-[#fff0ed] text-[#564240]/40 hover:text-[#ba1a1a] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
