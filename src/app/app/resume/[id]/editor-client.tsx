'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

import {
  useResume,
  useUpdateResume,
  useDownloadPdf,
  useResumePreview,
} from '@/app/app/_hooks/use-resumes';
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

export default function ResumeEditorClient({ resumeId }: ResumeEditorClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'failed'>('saved');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Fetch resume data and live preview html via TanStack Query
  const { data: resume, isLoading, isError } = useResume(resumeId);
  const { data: previewHtml, isLoading: isPreviewLoading } = useResumePreview(resumeId);
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
        // Send the entire form data so the sample data is saved to the DB
        payload = values;
      } else {
        // Send a sparse patch payload by comparing against lastSavedValues
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

  // Title changes save callback
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
        <h3 className="text-xl font-bold text-white mb-2">Resume Not Found</h3>
        <p className="text-on-surface-variant mb-6">This resume may have been deleted.</p>
        <button
          onClick={() => router.push('/app/dashboard')}
          className="px-6 py-2.5 rounded-full bg-electric-blue text-white text-[14px]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Editor Header */}
      <header className="h-[72px] shrink-0 border-b border-glass-border bg-surface-container-lowest/80 backdrop-blur-xl flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <input
            id="editor-resume-title"
            type="text"
            value={watch('title') || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-on-surface font-[Space_Grotesk] text-[20px] font-bold p-0 w-[200px] sm:w-[300px] hover:bg-white/5 rounded px-2 py-0.5 transition-colors -ml-2 truncate"
          />

          <div className="flex items-center gap-1.5 text-on-surface-variant text-[13px] font-medium bg-white/5 px-2.5 py-1 rounded-full border border-glass-border shrink-0">
            {saveStatus === 'saving' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'failed' ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-error shrink-0">
                  cloud_off
                </span>
                <span className="text-error">Save failed</span>
              </>
            ) : isDirty ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-amber-400 shrink-0">
                  pending
                </span>
                <span className="text-amber-400">Unsaved changes</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">
                  cloud_done
                </span>
                <span className="text-emerald-400">Saved</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview toggle */}
          <button
            onClick={() => setShowMobilePreview((prev) => !prev)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 border border-glass-border text-on-surface"
            aria-label="Toggle preview"
          >
            <span className="material-symbols-outlined">
              {showMobilePreview ? 'edit' : 'visibility'}
            </span>
          </button>

          <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-electric-blue text-white font-[Space_Grotesk] text-[14px] font-medium shadow-[0_0_15px_rgba(26,145,240,0.2)] hover:bg-electric-blue/90 hover:shadow-[0_0_25px_rgba(26,145,240,0.4)] transition-all disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadPdfMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-deep-indigo to-electric-blue text-white font-[Space_Grotesk] text-[14px] font-medium shadow-[0_0_15px_rgba(26,145,240,0.2)] hover:shadow-[0_0_25px_rgba(26,145,240,0.4)] transition-all disabled:opacity-50"
          >
            {downloadPdfMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Panel */}
        <section
          className={`w-full md:w-[500px] lg:w-[600px] shrink-0 flex flex-col border-r border-glass-border bg-surface relative z-10 transition-all ${
            showMobilePreview ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Stepper */}
          <div className="px-8 pt-8 pb-4">
            <SectionStepper active={activeSection} onChange={setActiveSection} />
          </div>

          {/* Form Canvas */}
          <div className="flex-1 overflow-y-auto px-8 pb-12 pt-4">
            <form onSubmit={(e) => e.preventDefault()}>
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
            </form>
          </div>
        </section>

        {/* Right Iframe Live Preview Panel */}
        <section
          className={`flex-1 bg-[#05080a] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-10 ${
            showMobilePreview ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Simulated Resume Paper Box */}
          <div className="w-full max-w-[800px] h-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg relative z-10 flex flex-col overflow-hidden">
            {isPreviewLoading && (
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
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
              <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 text-center bg-[#0b1014]">
                <span className="material-symbols-outlined text-4xl block mb-2">find_in_page</span>
                <p className="text-[14px]">Loading live preview...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
