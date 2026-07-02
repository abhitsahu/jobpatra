'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateResume } from '@/app/app/_hooks/use-resumes';
import { useTemplates } from '@/app/app/_hooks/use-templates';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { motion } from 'framer-motion';

export default function NewResumeClient() {
  const router = useRouter();
  const [title, setTitle] = useState('My Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('classic-demo');

  const { data: templates, isLoading } = useTemplates();
  const createMutation = useCreateResume();

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      const resume = await createMutation.mutateAsync({
        title: title.trim(),
        templateId: selectedTemplate,
      });
      router.push(`/app/resume/${resume.id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
    }
  };

  return (
    <div className="h-full overflow-y-auto relative flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-deep-indigo/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-electric-blue/10 blur-[100px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-surface-container border border-glass-border rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-[32px] font-bold text-white font-[Space_Grotesk]">
            Create a New Resume
          </h2>
          <p className="text-on-surface-variant text-[14px]">
            Enter a title and select a design template to begin.
          </p>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Resume Title
          </label>
          <input
            id="new-resume-fullscreen-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-3.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="e.g. Senior Software Engineer Resume"
          />
        </div>

        {/* Template Grid */}
        <div className="space-y-3">
          <label className="block text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
            Choose a Template
          </label>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
              {Array.isArray(templates) && templates.length > 0 ? (
                (templates as { id: string; name: string; description?: string }[]).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      selectedTemplate === t.id
                        ? 'border-electric-blue bg-electric-blue/10 text-white shadow-[0_0_15px_rgba(26,145,240,0.15)]'
                        : 'border-glass-border bg-surface-container-low text-on-surface-variant hover:border-outline hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center mb-4 border border-glass-border group-hover:text-electric-blue transition-colors">
                      <span className="material-symbols-outlined text-[22px]">description</span>
                    </div>
                    <p className="text-[15px] font-semibold text-white">{t.name}</p>
                    <p className="text-[12px] text-on-surface-variant mt-1">
                      {t.description || 'Professional resume layout'}
                    </p>
                  </button>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl block mb-2">description</span>
                  No templates available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.push('/app/dashboard')}
            className="flex-1 py-3.5 rounded-full border border-glass-border text-on-surface hover:bg-white/5 text-[14px] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="fullscreen-create-resume-btn"
            onClick={handleCreate}
            disabled={createMutation.isPending || !title.trim()}
            className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-deep-indigo to-electric-blue text-white text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create & Continue</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
