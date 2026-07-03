'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateResume, useResumes } from '@/app/app/_hooks/use-resumes';
import { useTemplates } from '@/app/app/_hooks/use-templates';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
  thumbnail?: string;
  category?: string;
}

export default function NewResumeClient() {
  const router = useRouter();
  const [title, setTitle] = useState('My Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('classic-demo');

  const { data: templates, isLoading } = useTemplates();
  const { data: resumesData } = useResumes();
  const createMutation = useCreateResume();

  const resumesCount = resumesData?.total ?? 0;

  const handleCreate = async () => {
    if (!title.trim() || !selectedTemplate) return;
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

  const getTemplateImageUrl = (t: Template) => {
    if (t.previewUrl && (t.previewUrl.startsWith('http') || t.previewUrl.startsWith('/'))) {
      return t.previewUrl;
    }
    if (t.thumbnail && (t.thumbnail.startsWith('http') || t.thumbnail.startsWith('/'))) {
      return t.thumbnail;
    }
    return `/api/template/${encodeURIComponent(t.id)}/thumbnail`;
  };

  return (
    <div className="flex-1 min-h-screen bg-surface-charcoal text-on-surface flex flex-col relative overflow-y-auto pb-32">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-deep-indigo/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-electric-blue/10 blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 pt-12 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="font-headline-md text-3xl font-bold text-on-surface mb-2">
              Create Resume
            </h2>
            <p className="text-on-surface-variant font-body-md text-sm md:text-base">
              Choose a professional template and start building your resume.
            </p>
          </div>
          <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-on-surface-variant font-label-caps text-[10px] tracking-widest opacity-60 uppercase font-semibold">
                Resume Count
              </p>
              <p className="text-on-surface font-headline-md text-[24px] font-bold">
                {resumesCount}/15
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full">
              <span
                className="material-symbols-outlined text-neon-purple text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
              <span className="text-neon-purple font-label-caps text-xs font-semibold uppercase tracking-wider">
                PRO
              </span>
            </div>
            <button className="p-2 rounded-full border border-glass-border hover:bg-white/5 transition-colors hidden sm:block">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                help_outline
              </span>
            </button>
          </div>
        </header>

        {/* Resume Title Section */}
        <section className="mb-12 max-w-xl">
          <div className="relative group">
            <label
              htmlFor="resume-title"
              className="absolute -top-2 left-4 px-1.5 bg-surface-charcoal text-electric-blue font-label-caps text-[10px] font-bold tracking-wider z-10"
            >
              RESUME TITLE
            </label>
            <input
              id="resume-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-lowest border border-glass-border rounded-xl px-4 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-electric-blue focus:border-electric-blue transition-all"
              placeholder="e.g. My Software Engineer Resume"
            />
            <p className="mt-2 text-on-surface-variant text-[11px] opacity-60">
              This title is only visible to you.
            </p>
          </div>
        </section>

        {/* Template Gallery */}
        <section className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-6">
            Choose a Template
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-glass-border rounded-2xl p-4 space-y-4"
                >
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(templates) && templates.length > 0 ? (
                (templates as Template[]).map((t: Template) => {
                  const imageUrl = getTemplateImageUrl(t);
                  const isSelected = selectedTemplate === t.id;

                  return (
                    <motion.div
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`p-4 rounded-2xl cursor-pointer flex flex-col h-full transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-white/5 border border-electric-blue shadow-[0_0_20px_rgba(26,145,240,0.25)] scale-[1.01]'
                          : 'bg-white/[0.02] hover:bg-white/[0.04] border border-glass-border hover:border-white/20'
                      }`}
                    >
                      <div className="flex-1 aspect-[3/4] mb-4 rounded-xl overflow-hidden relative border border-glass-border bg-surface-container-lowest flex items-center justify-center">
                        {imageUrl ? (
                          <div
                            className="w-full h-full bg-cover bg-top transition-transform duration-500 hover:scale-105"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-low flex flex-col items-center justify-center p-6 text-center">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                              description
                            </span>
                            <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">
                              {t.category || 'Classic'}
                            </span>
                          </div>
                        )}

                        {/* Selected Icon Overlay */}
                        <div
                          className={`absolute top-3 right-3 bg-electric-blue text-white w-6 h-6 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                            isSelected ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px] font-bold">
                            check
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-[15px] text-white">{t.name}</h4>
                          {t.id === 'classic-demo' && (
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-on-surface-variant text-[12px]">
                          {t.description || 'ATS Friendly, Modern'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 border border-dashed border-glass-border rounded-2xl bg-white/[0.01]">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-2">
                    description
                  </span>
                  <p className="text-on-surface-variant text-sm">No templates available</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Sticky Footer Action Bar */}
      <footer className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-surface-container-low/90 backdrop-blur-xl border-t border-glass-border p-6 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/app/dashboard')}
            className="px-6 py-3 rounded-full border border-glass-border text-on-surface-variant text-sm font-semibold hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <div className="flex items-center gap-6">
            <AnimatePresence>
              {!selectedTemplate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-on-surface-variant text-sm italic"
                >
                  Please select a template
                </motion.p>
              )}
            </AnimatePresence>
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending || !title.trim() || !selectedTemplate}
              className={`px-10 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center gap-2 ${
                !title.trim() || !selectedTemplate
                  ? 'bg-electric-blue/50 text-white/50 cursor-not-allowed'
                  : 'bg-electric-blue text-white hover:brightness-110 shadow-[0_0_15px_rgba(26,145,240,0.3)]'
              }`}
            >
              {createMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Resume</span>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
