'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { SECTION_REGISTRY } from '@/app/app/_components/features/resume-editor/section-registry';

import {
  useResume,
  useUpdateResume,
  useDownloadPdf,
  useResumePreview,
} from '@/app/app/_hooks/use-resumes';
import { useTemplate } from '@/app/app/_hooks/use-templates';
import { SectionStepper } from '@/app/app/_components/features/resume-editor/section-stepper';
import { PersonalInfoForm } from '@/app/app/_components/features/resume-editor/personal-info-form';
import { SummaryForm } from '@/app/app/_components/features/resume-editor/summary-form';
import { ExperienceForm } from '@/app/app/_components/features/resume-editor/experience-form';
import { EducationForm } from '@/app/app/_components/features/resume-editor/education-form';
import { ProjectsForm } from '@/app/app/_components/features/resume-editor/projects-form';
import { SkillsForm } from '@/app/app/_components/features/resume-editor/skills-form';
import { CertificationsForm } from '@/app/app/_components/features/resume-editor/certifications-form';
import { AchievementsForm } from '@/app/app/_components/features/resume-editor/achievements-form';
import { LanguagesForm } from '@/app/app/_components/features/resume-editor/languages-form';
import { ReferencesForm } from '@/app/app/_components/features/resume-editor/references-form';

import { SkillCategory, LanguageProficiency } from '@/app/api/model/enums/resume';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { useRouter } from 'next/navigation';

interface ResumeEditorClientProps {
  resumeId: string;
}

// Derived dynamically from SECTION_REGISTRY — no section names hardcoded here.
// Maps template metadata.json key (e.g. "personal") → editor form key (e.g. "personalInfo").
const TEMPLATE_KEY_TO_EDITOR = Object.fromEntries(
  SECTION_REGISTRY.map((s) => [s.templateKey, s.key]),
);

export default function ResumeEditorClient({ resumeId }: ResumeEditorClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'failed'>('saved');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showAiWorkspace, setShowAiWorkspace] = useState(true);

  // Fetch resume data and live preview html via TanStack Query
  const { data: resume, isLoading, isError } = useResume(resumeId);
  const { data: previewHtml, isLoading: isPreviewLoading } = useResumePreview(resumeId);
  const { data: templateData } = useTemplate(resume?.templateId ?? '');
  const updateMutation = useUpdateResume(resumeId);
  const downloadPdfMutation = useDownloadPdf();

  const form = useForm<UpdateResumeDTO>({
    defaultValues: {
      title: '',
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
      },
      experiences: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
      references: [],
    },
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = form;

  // ── Derive visible sections directly from template metadata ─────────────
  // Order and presence come 100% from the `sections` array in metadata.json.
  // No hardcoded list lives here — TEMPLATE_KEY_TO_EDITOR is just a translator.
  const templateRawSections = (templateData as { sections?: string[] } | null)?.sections ?? [];
  const visibleSectionsKeys = templateRawSections
    .map((k) => TEMPLATE_KEY_TO_EDITOR[k])
    .filter(Boolean) as string[];

  // Auto-correct active section when template changes and active section is no longer visible
  useEffect(() => {
    if (visibleSectionsKeys.length > 0 && !visibleSectionsKeys.includes(activeSection)) {
      setActiveSection(visibleSectionsKeys[0]);
    }
  }, [visibleSectionsKeys, activeSection]);

  // Track initialization and last saved values to prevent form resets and redundant patches
  const isInitialized = useRef<string | null>(null); // stores the resumeId that was initialized
  const lastSavedValues = useRef<UpdateResumeDTO | null>(null);
  const isSampleDataRef = useRef(false);

  // Sync DB record to Form values only ONCE per resumeId
  useEffect(() => {
    if (resume && isInitialized.current !== resumeId) {
      isSampleDataRef.current = !!resume.isSampleData;

      const initialValues: UpdateResumeDTO = {
        title: resume.title ?? '',
        personalInfo: {
          fullName: resume.personalInfo?.fullName ?? '',
          jobTitle: resume.personalInfo?.jobTitle ?? '',
          email: resume.personalInfo?.email ?? '',
          phone: resume.personalInfo?.phone ?? '',
          location: resume.personalInfo?.location ?? '',
          website: resume.personalInfo?.website ?? '',
          linkedin: resume.personalInfo?.linkedin ?? '',
          github: resume.personalInfo?.github ?? '',
          summary: resume.personalInfo?.summary ?? '',
        },
        experiences:
          resume.experiences?.map((e) => ({
            company: e.company,
            position: e.position,
            location: e.location ?? '',
            startDate: e.startDate,
            endDate: e.endDate ?? '',
            currentlyWorking: e.currentlyWorking ?? false,
            description: e.description ?? '',
            highlights: e.highlights ?? [],
            order: e.order,
          })) ?? [],
        education:
          resume.education?.map((e) => ({
            institution: e.institution,
            degree: e.degree,
            fieldOfStudy: e.fieldOfStudy ?? '',
            startDate: e.startDate,
            endDate: e.endDate ?? '',
            result: e.result ?? '',
            order: e.order,
          })) ?? [],
        projects:
          resume.projects?.map((p) => ({
            title: p.title,
            field: p.field ?? '',
            startDate: p.startDate ?? '',
            endDate: p.endDate ?? '',
            description: p.description ?? '',
            technologies: p.technologies ?? [],
            link: p.link ?? '',
            order: p.order,
          })) ?? [],
        skills:
          resume.skills?.map((s) => ({
            name: s.name,
            category: s.category as SkillCategory,
            order: s.order,
          })) ?? [],
        certifications:
          resume.certifications?.map((c) => ({
            name: c.name,
            issuer: c.issuer ?? '',
            date: c.date ?? '',
            url: c.url ?? '',
            order: c.order,
          })) ?? [],
        achievements:
          resume.achievements?.map((a) => ({
            title: a.title,
            date: a.date ?? '',
            description: a.description ?? '',
            order: a.order,
          })) ?? [],
        languages:
          resume.languages?.map((l) => ({
            name: l.name,
            proficiency: l.proficiency as LanguageProficiency,
            order: l.order,
          })) ?? [],
        references:
          resume.references?.map((r) => ({
            name: r.name,
            designation: r.designation ?? '',
            company: r.company ?? '',
            email: r.email ?? '',
            phone: r.phone ?? '',
            order: r.order,
          })) ?? [],
      };

      reset(initialValues);
      lastSavedValues.current = initialValues;
      isInitialized.current = resumeId;
    }
  }, [resume, reset]);

  // Manual save logic
  const onSubmit = async (values: UpdateResumeDTO) => {
    try {
      setSaveStatus('saving');
      let payload: UpdateResumeDTO;

      if (isSampleDataRef.current) {
        payload = values;
      } else {
        const patchPayload: UpdateResumeDTO = {};
        let hasChanges = false;

        const keys = Object.keys(values) as Array<keyof UpdateResumeDTO>;
        for (const key of keys) {
          const currentStr = JSON.stringify(values[key]);
          const lastStr = JSON.stringify(lastSavedValues.current?.[key]);

          if (currentStr !== lastStr) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            patchPayload[key] = values[key] as any;
            hasChanges = true;
          }
        }

        if (!hasChanges) {
          setSaveStatus('saved');
          return;
        }
        payload = patchPayload;
      }

      await updateMutation.mutateAsync(payload);
      const updatedValues = { ...values };
      reset(updatedValues);
      lastSavedValues.current = updatedValues;
      isSampleDataRef.current = false;
      setSaveStatus('saved');
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('failed');
    }
  };

  const handleTitleChange = (newTitle: string) => {
    form.setValue('title', newTitle, { shouldDirty: true });
  };

  const handleDownloadPdf = () => {
    downloadPdfMutation.mutate({
      id: resumeId,
      filename: `${resume?.title || 'resume'}.pdf`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fff8f6]">
        <span className="material-symbols-outlined text-5xl text-[#7a1f1f] mb-4">error</span>
        <h3 className="text-xl font-bold text-[#2b1611] mb-2">Resume Not Found</h3>
        <p className="text-[#564240] mb-6">This resume may have been deleted.</p>
        <button
          onClick={() => router.push('/app/dashboard')}
          className="px-6 py-2.5 rounded-full bg-[#7a1f1f] text-white text-[14px] font-bold cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentIdx = visibleSectionsKeys.indexOf(activeSection);
  const prevSection = visibleSectionsKeys[currentIdx - 1];
  const nextSection = visibleSectionsKeys[currentIdx + 1];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
      {/* Editor Header / Top Application Bar */}
      <header className="h-16 border-b border-[#ddc0bd] bg-white flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7a1f1f]">description</span>
            <input
              id="editor-resume-title"
              type="text"
              // eslint-disable-next-line react-hooks/incompatible-library
              value={watch('title') || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-transparent border-none focus:ring-1 focus:ring-[#7a1f1f]/20 text-[#2b1611] font-['Hanken_Grotesk'] text-[15px] font-bold p-1 w-[150px] sm:w-[220px] hover:bg-[#fff0ed] rounded transition-colors truncate focus:outline-none"
            />
          </div>

          <div className="h-4 w-px bg-[#ddc0bd] hidden sm:block"></div>

          <div className="hidden sm:flex items-center gap-2 text-[#564240]">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span className="text-[12px] font-semibold">
              Template:{' '}
              <span className="font-bold text-[#2b1611]">{resume.templateId || 'Default'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#564240] text-[12px] font-semibold bg-[#fff0ed] px-2.5 py-1 rounded-full border border-[#ddc0bd]/60 shrink-0">
            {saveStatus === 'saving' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#7a1f1f]/20 border-t-[#7a1f1f] rounded-full animate-spin shrink-0" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'failed' ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-[#7a1f1f] shrink-0">
                  cloud_off
                </span>
                <span className="text-[#7a1f1f]">Save failed</span>
              </>
            ) : isDirty ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-[#795900] shrink-0">
                  pending
                </span>
                <span className="text-[#795900]">Unsaved changes</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">
                  cloud_done
                </span>
                <span className="text-emerald-600">Saved</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview toggle */}
          <button
            onClick={() => setShowMobilePreview((prev) => !prev)}
            className="md:hidden p-2 rounded-full hover:bg-[#fff0ed] border border-[#ddc0bd] text-[#564240]"
            aria-label="Toggle preview"
          >
            <span className="material-symbols-outlined">
              {showMobilePreview ? 'edit' : 'visibility'}
            </span>
          </button>

          <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
            className="px-4 py-2 text-[#7a1f1f] font-bold text-[14px] hover:bg-[#fff0ed] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadPdfMutation.isPending}
            className="bg-[#7a1f1f] text-white px-5 py-2 rounded-lg font-bold text-[14px] shadow-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {downloadPdfMutation.isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <span>Finish & Download</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Panel */}
        <section
          className={`w-full md:w-[480px] lg:w-[540px] shrink-0 flex flex-col border-r border-[#ddc0bd] bg-white relative z-10 transition-all ${
            showMobilePreview ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Stepper / Horizontal Section Navigation */}
          <SectionStepper
            active={activeSection}
            onChange={setActiveSection}
            form={form}
            templateSections={(templateData as { sections?: string[] } | null)?.sections}
          />

          {/* Form Canvas */}
          <div className="flex-1 overflow-y-auto px-8 pb-12 pt-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {activeSection === 'personalInfo' && <PersonalInfoForm form={form} />}
              {activeSection === 'summary' && <SummaryForm form={form} />}
              {activeSection === 'experience' && <ExperienceForm form={form} />}
              {activeSection === 'education' && <EducationForm form={form} />}
              {activeSection === 'projects' && <ProjectsForm form={form} />}
              {activeSection === 'skills' && <SkillsForm form={form} />}
              {activeSection === 'certifications' && <CertificationsForm form={form} />}
              {activeSection === 'achievements' && <AchievementsForm form={form} />}
              {activeSection === 'languages' && <LanguagesForm form={form} />}
              {activeSection === 'references' && <ReferencesForm form={form} />}

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-8 border-t border-[#ddc0bd]/30 mt-8">
                {prevSection ? (
                  <button
                    type="button"
                    onClick={() => setActiveSection(prevSection)}
                    className="text-[#564240] font-semibold text-[13px] tracking-wider uppercase flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#fff0ed] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">west</span>
                    Previous
                  </button>
                ) : (
                  <div />
                )}
                {nextSection && (
                  <button
                    type="button"
                    onClick={() => setActiveSection(nextSection)}
                    className="bg-[#7a1f1f] text-white px-5 py-2 rounded-lg font-bold text-[13px] tracking-wider uppercase shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Next Section
                    <span className="material-symbols-outlined text-base">east</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Right Preview Panel (Centered, simulated A4 print preview) */}
        <section
          className={`flex-1 bg-[#fcf9f5] relative overflow-hidden flex flex-col items-center justify-between ${
            showMobilePreview ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Floating Preview Toolbar */}
          <div className="w-full h-12 border-b border-[#ddc0bd]/30 px-6 flex items-center justify-between bg-white/50 backdrop-blur-sm z-20 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#564240]/60">
              Live Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
                className="p-1.5 hover:bg-[#fff0ed] rounded-lg transition-colors text-[#564240] hover:text-[#7a1f1f] cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-base">remove</span>
              </button>
              <span className="text-[12px] font-semibold text-[#2b1611] px-1 font-['Hanken_Grotesk']">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                className="p-1.5 hover:bg-[#fff0ed] rounded-lg transition-colors text-[#564240] hover:text-[#7a1f1f] cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
              <div className="w-px h-4 bg-[#ddc0bd] mx-1"></div>
              <button
                onClick={handleDownloadPdf}
                className="p-1.5 hover:bg-[#fff0ed] rounded-lg transition-colors text-[#564240] hover:text-[#7a1f1f] cursor-pointer"
                title="Download PDF"
              >
                <span className="material-symbols-outlined text-base">download</span>
              </button>
            </div>
          </div>

          {/* Simulated Resume Paper Box Container */}
          <div className="flex-1 w-full flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
              className="w-full max-w-[560px] aspect-[1/1.414] bg-white shadow-[0_10px_40px_-10px_rgba(78,52,46,0.15)] rounded border border-[#ddc0bd]/40 relative z-10 flex flex-col overflow-hidden transition-transform duration-200"
            >
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-[#fff8f6]/40 backdrop-blur-[1px] z-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#7a1f1f]/20 border-t-[#7a1f1f] rounded-full animate-spin" />
                </div>
              )}

              {/* Resume Preview Document Iframe */}
              {previewHtml ? (
                <iframe
                  id="resume-preview-iframe"
                  srcDoc={previewHtml}
                  className="w-full h-full border-none bg-white"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#564240] p-8 text-center bg-[#fff8f6]">
                  <span className="material-symbols-outlined text-4xl block mb-2">
                    find_in_page
                  </span>
                  <p className="text-[14px]">Loading live preview...</p>
                </div>
              )}
            </div>
          </div>

          {/* Mini Toggle for Collapsed State */}
          {!showAiWorkspace && (
            <button
              onClick={() => setShowAiWorkspace(true)}
              className="absolute right-4 top-16 bg-white shadow-md w-8 h-8 rounded-full border border-[#ddc0bd] flex items-center justify-center text-[#7a1f1f] hover:bg-[#fff0ed] transition-colors cursor-pointer z-30"
              title="Open AI Suggestions"
            >
              <span className="material-symbols-outlined text-lg">sparkles</span>
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
