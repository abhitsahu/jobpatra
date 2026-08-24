'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateResume } from '@/app/app/_hooks/use-resumes';
import { useTemplates } from '@/app/app/_hooks/use-templates';
import { useUserProfile } from '@/app/app/_hooks/use-user-profile';
import { useSubscriptionStatus } from '@/app/app/_hooks/use-subscription';
import { getResumeClient } from '@/app/api/client/resume/resume-client';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { cn } from '@/app/app/_util/cn';
import { SkillCategory, LanguageProficiency } from '@/app/api/model/enums/resume';

export default function NewResumeClient() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showImportPrompt, setShowImportPrompt] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const nibRef = useRef<HTMLSpanElement>(null);

  const { data: templatesData, isLoading } = useTemplates();
  const { data: userProfile } = useUserProfile();
  const { data: subData } = useSubscriptionStatus();
  const createMutation = useCreateResume();

  // Resume count from subscription usage (same source as Dashboard) — not raw DB count
  const resumesUsed = subData?.usage?.resumes?.current ?? 0;
  const resumesMax = subData?.usage?.resumes?.max;
  const resumesMaxLabel = resumesMax === -1 ? '∞' : (resumesMax ?? '—');
  const categories: string[] = templatesData?.categories ?? ['All'];
  const hasProfile = !!userProfile?.profileResumeId;

  // Dynamic search + category filter
  const filtered = useMemo(() => {
    const templates = templatesData?.templates ?? [];
    return templates.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templatesData?.templates, activeCategory, search]);

  // Limit check using live usage data (matches Dashboard) — -1 means unlimited
  const atLimit = resumesMax !== undefined && resumesMax !== -1 && resumesUsed >= resumesMax;
  const canCreate = title.trim().length > 0 && !!selectedTemplate && !atLimit;

  /** Called when user clicks "Create Resume" in the sticky footer */
  const handleCreate = () => {
    if (!canCreate) return;
    // If the user has a saved profile, show the import prompt
    if (hasProfile) {
      setShowImportPrompt(true);
    } else {
      createBlank();
    }
  };

  /** Create resume without importing any profile data */
  const createBlank = async () => {
    setIsCreating(true);
    try {
      const resume = await createMutation.mutateAsync({
        title: title.trim(),
        templateId: selectedTemplate!,
      });
      router.push(`/app/resume/${resume.id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
      setIsCreating(false);
    }
  };

  /**
   * Create resume then SNAPSHOT-COPY all sections from the profile resume.
   * The two resumes are fully independent after this — editing one never
   * touches the other (each section row belongs to its own resumeId).
   */
  const createWithProfileImport = async () => {
    if (!userProfile?.profileResumeId) return createBlank();
    setIsCreating(true);
    try {
      // 1. Create blank resume
      const resume = await createMutation.mutateAsync({
        title: title.trim(),
        templateId: selectedTemplate!,
      });

      // 2. Fetch full profile resume (all sections)
      const profileData = await getResumeClient(userProfile.profileResumeId);

      // 3. Build a clean payload — strip DB fields, keep only DTO-compatible fields
      const importPayload = {
        personalInfo: profileData.personalInfo
          ? {
              fullName: profileData.personalInfo.fullName ?? '',
              jobTitle: profileData.personalInfo.jobTitle ?? '',
              email: profileData.personalInfo.email ?? '',
              phone: profileData.personalInfo.phone ?? '',
              location: profileData.personalInfo.location ?? '',
              website: profileData.personalInfo.website ?? '',
              linkedin: profileData.personalInfo.linkedin ?? '',
              github: profileData.personalInfo.github ?? '',
              summary: profileData.personalInfo.summary ?? '',
            }
          : undefined,
        experiences: profileData.experiences?.map((e, i) => ({
          company: e.company,
          position: e.position,
          location: e.location ?? '',
          startDate: e.startDate,
          endDate: e.endDate ?? '',
          currentlyWorking: e.currentlyWorking ?? false,
          description: e.description ?? '',
          highlights: e.highlights ?? [],
          order: i,
        })) ?? [],
        education: profileData.education?.map((e, i) => ({
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy ?? '',
          startDate: e.startDate,
          endDate: e.endDate ?? '',
          result: e.result ?? '',
          order: i,
        })) ?? [],
        projects: profileData.projects?.map((p, i) => ({
          title: p.title,
          field: p.field ?? '',
          startDate: p.startDate ?? '',
          endDate: p.endDate ?? '',
          description: p.description ?? '',
          technologies: p.technologies ?? [],
          link: p.link ?? '',
          order: i,
        })) ?? [],
        skills: profileData.skills?.map((s, i) => ({
          name: s.name,
          category: s.category as SkillCategory,
          order: i,
        })) ?? [],
        certifications: profileData.certifications?.map((c, i) => ({
          name: c.name,
          issuer: c.issuer ?? '',
          date: c.date ?? '',
          url: c.url ?? '',
          order: i,
        })) ?? [],
        achievements: profileData.achievements?.map((a, i) => ({
          title: a.title,
          date: a.date ?? '',
          description: a.description ?? '',
          order: i,
        })) ?? [],
        languages: profileData.languages?.map((l, i) => ({
          name: l.name,
          proficiency: l.proficiency as LanguageProficiency,
          order: i,
        })) ?? [],
        references: profileData.references?.map((r, i) => ({
          name: r.name,
          designation: r.designation ?? '',
          company: r.company ?? '',
          email: r.email ?? '',
          phone: r.phone ?? '',
          order: i,
        })) ?? [],
      };

      // 4. PATCH all sections into the new resume (existing transactional endpoint)
      const { updateResumeClient } = await import('@/app/api/client/resume/resume-client');
      await updateResumeClient(resume.id, importPayload);

      router.push(`/app/resume/${resume.id}`);
    } catch (err) {
      console.error('Failed to import profile data:', err);
      setIsCreating(false);
    }
  };


  return (
    // Warm desk base — paper texture backdrop
    <div className="flex-1 min-h-screen pb-32 overflow-y-auto" style={{ background: '#F8F2E8' }}>
      {/* Natural paper texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
          opacity: 0.03,
        }}
      />

      <div className="relative z-[2] max-w-5xl mx-auto px-12 py-10">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div>
            <h1
              className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-[#5b060c] mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Create Resume
            </h1>
            <p
              className="text-[18px] leading-[28px] text-[#564240]"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Choose a professional template and start building your resume.
            </p>
          </div>

          {/* Workspace Card */}
          <div
            className="flex items-center gap-4 px-6 py-4 rounded-xl border border-[#E5D9C8] transition-all duration-300 hover:-translate-y-0.5 shrink-0"
            style={{
              background: '#FFF8EE',
              boxShadow: '0 10px 30px -10px rgba(78,52,46,0.08)',
            }}
          >
            <div className="flex flex-col">
              <span
                className="text-[12px] leading-[16px] font-medium text-[#564240] uppercase tracking-widest"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                Workspace
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[24px] leading-[32px] font-semibold text-[#5b060c]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {resumesUsed} / {resumesMaxLabel}
                </span>
                <span
                  className="text-[12px] text-[#564240]"
                  style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                >
                  Resumes
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-[#ddc0bd]" />

            <div className="flex flex-col items-end gap-2">
              {/* Gold PRO Badge */}
              <span
                className="px-2 py-0.5 rounded text-[10px] text-white font-bold tracking-tighter"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                  boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
                  fontFamily: 'Hanken Grotesk, sans-serif',
                }}
              >
                PRO
              </span>
              <button
                className="text-[#795900] text-[12px] font-semibold hover:underline"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* ── Resume Title ─────────────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span
                ref={nibRef}
                className="material-symbols-outlined text-[#5b060c] transition-all duration-300"
                style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
              >
                edit_note
              </span>
              <h2
                className="text-[14px] leading-[20px] uppercase tracking-widest font-semibold text-[#564240]"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                Resume Title
              </h2>
            </div>

            {/* Paper-style input shell */}
            <div
              className="p-1 rounded-lg"
              style={{
                background: '#FFF8EE',
                border: '1px solid #E5D9C8',
                boxShadow: '0 10px 30px -10px rgba(78,52,46,0.08)',
              }}
            >
              <input
                id="resume-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => {
                  if (nibRef.current) {
                    nibRef.current.style.transform = 'scale(1.2)';
                    nibRef.current.style.color = '#795900';
                  }
                }}
                onBlur={() => {
                  if (nibRef.current) {
                    nibRef.current.style.transform = 'scale(1)';
                    nibRef.current.style.color = '#5b060c';
                  }
                }}
                className="w-full bg-transparent border-none outline-none ring-0 px-6 py-4 text-[#5b060c] placeholder:text-[#8a716f]/60"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 24,
                  lineHeight: '32px',
                  fontWeight: 600,
                }}
                placeholder="e.g. Senior Product Designer"
              />
            </div>
            <p
              className="mt-2 text-[12px] text-[#564240] italic"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              This title is only visible to you.
            </p>
          </div>
        </section>

        {/* ── Template Section ─────────────────────────────────────────────── */}
        <section>
          {/* Section header + search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2
                className="text-[32px] leading-[40px] font-semibold text-[#5b060c] mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Choose a Template
              </h2>
              <p
                className="text-[16px] text-[#564240]"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                Select a resume template to begin editing. You can change your template later.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8a716f]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-12 pr-4 py-3 border border-[#ddc0bd] rounded-full transition-all outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c]/20"
                style={{
                  background: '#fff0ed',
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  fontSize: 14,
                  lineHeight: '20px',
                }}
              />
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-5 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors',
                  activeCategory === cat
                    ? 'bg-[#5b060c] text-white'
                    : 'text-[#564240] hover:bg-[#ddc0bd]/30',
                )}
                style={{
                  fontFamily: 'Hanken Grotesk, sans-serif',
                  background: activeCategory === cat ? '#5b060c' : '#ffe2db',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 border border-dashed border-[#ddc0bd] rounded-xl">
              <span className="material-symbols-outlined text-4xl text-[#564240]/40 block mb-2">
                search_off
              </span>
              <p
                className="text-[#564240] text-sm"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                No templates match your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((t) => {
                const isSelected = selectedTemplate === t.id;
                return (
                  <div key={t.id} className="group relative">
                    {/* Card shell */}
                    <div
                      onClick={() => setSelectedTemplate(t.id)}
                      className={cn(
                        'aspect-[3/4] rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300',
                        isSelected
                          ? 'border-[#5b060c]'
                          : 'border-[#E5D9C8] hover:border-[#5b060c]/40',
                      )}
                      style={{
                        background: '#FFF8EE',
                        border: isSelected ? '2px solid #5b060c' : '1px solid #E5D9C8',
                        boxShadow: isSelected
                          ? '0 0 0 4px rgba(91,6,12,0.05), 0 10px 30px -10px rgba(78,52,46,0.12)'
                          : '0 10px 30px -10px rgba(78,52,46,0.08)',
                      }}
                    >
                      {/* Selected primary overlay tint */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#5b060c]/5 pointer-events-none z-10" />
                      )}

                      {/* Template preview image */}
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url('${t.previewImage}')`,
                          backgroundSize: 'cover',
                        }}
                      />

                      {/* Fallback pattern if no image */}
                      {!t.previewImage && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EE] to-[#ffe2db] flex flex-col items-center justify-center p-4 text-center">
                          <span className="material-symbols-outlined text-4xl text-[#564240]/40 mb-2">
                            description
                          </span>
                          <span
                            className="text-[10px] font-semibold text-[#564240]/60 uppercase tracking-widest"
                            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                          >
                            {t.category}
                          </span>
                        </div>
                      )}

                      {/* Selected checkmark */}
                      <div
                        className={cn(
                          'absolute top-3 right-3 z-20 w-8 h-8 bg-[#5b060c] rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
                          isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                        )}
                      >
                        <span
                          className="material-symbols-outlined text-white text-sm"
                          style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      </div>

                      {/* ATS badge */}
                      {t.atsFriendly && (
                        <div className="absolute top-3 left-3 z-20">
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white"
                            style={{
                              background: '#2d6a4f',
                              fontFamily: 'Hanken Grotesk, sans-serif',
                            }}
                          >
                            ATS
                          </span>
                        </div>
                      )}

                      {/* Premium badge */}
                      {t.isPremium && (
                        <div className="absolute bottom-3 right-3 z-20">
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter text-white"
                            style={{
                              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                              fontFamily: 'Hanken Grotesk, sans-serif',
                            }}
                          >
                            PRO
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card info */}
                    <div className="mt-3">
                      <h3
                        className={cn(
                          'text-[14px] font-semibold leading-[20px] tracking-[0.05em] transition-colors',
                          isSelected ? 'text-[#5b060c]' : 'text-[#2b1611]',
                        )}
                        style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                      >
                        {t.name}
                      </h3>
                      <p
                        className="text-[12px] text-[#564240] mt-0.5"
                        style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
                      >
                        {t.category}
                        {t.atsFriendly ? ' • ATS Friendly' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Sticky Footer Action Bar ────────────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-56 right-0 z-50 border-t border-[#ddc0bd] px-12 py-5 flex items-center justify-between"
        style={{ background: '#ffffff' }}
      >
        {/* Hint */}
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[#795900] text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_fix
          </span>
          <p
            className="text-[12px] text-[#564240]"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            <span className="font-bold text-[#795900]">AI Assistant Ready:</span>{' '}
            {selectedTemplate
              ? hasProfile
                ? 'Profile detected — you can auto-fill this resume.'
                : 'Selected template is ready to use.'
              : 'Select a template to get started.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/app/dashboard')}
            className="px-6 py-2.5 rounded-lg border border-[#8a716f] text-[#564240] font-semibold text-[14px] hover:bg-[#fff0ed] transition-colors cursor-pointer"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!canCreate || isCreating}
            className={cn(
              'flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-[14px] transition-all shadow-lg cursor-pointer',
              canCreate && !isCreating
                ? 'bg-[#5b060c] text-white hover:opacity-95 active:scale-[0.98]'
                : 'bg-[#5b060c]/40 text-white/60 cursor-not-allowed',
            )}
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            {isCreating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create Resume</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </footer>

      {/* ── Import from Profile Modal ─────────────────────────────────────────── */}
      {showImportPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(43,22,17,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
            style={{ background: '#FFF8EE', border: '1px solid #E5D9C8' }}
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#5b060c]/5 rounded-bl-full pointer-events-none" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-[#fff0ed] border-2 border-[#ddc0bd] flex items-center justify-center mb-5">
              <span
                className="material-symbols-outlined text-[#5b060c] text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                download_for_offline
              </span>
            </div>

            <h2
              className="text-[22px] font-bold text-[#5b060c] mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Import from Profile?
            </h2>
            <p
              className="text-[14px] text-[#564240] mb-6 leading-relaxed"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              Your saved career profile will be copied into this resume — all sections
              (experience, education, skills, etc.). You can edit them freely without
              affecting your profile.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportPrompt(false);
                  createWithProfileImport();
                }}
                disabled={isCreating}
                className="flex-1 flex items-center justify-center gap-2 bg-[#5b060c] text-white px-5 py-3 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  download_for_offline
                </span>
                Yes, Auto-fill
              </button>
              <button
                onClick={() => {
                  setShowImportPrompt(false);
                  createBlank();
                }}
                disabled={isCreating}
                className="flex-1 px-5 py-3 rounded-lg border border-[#8a716f] text-[#564240] font-semibold text-[14px] hover:bg-[#fff0ed] transition-all cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                Start Blank
              </button>
            </div>

            <button
              onClick={() => setShowImportPrompt(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ffe2db] transition-colors text-[#564240] cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Decorative paper clip */}
      <div className="fixed top-24 right-12 z-[3] pointer-events-none opacity-40">
        <span
          className="material-symbols-outlined text-[#8a716f]"
          style={{ fontSize: 48, transform: 'rotate(45deg)', display: 'block' }}
        >
          attach_file
        </span>
      </div>
    </div>
  );
}
