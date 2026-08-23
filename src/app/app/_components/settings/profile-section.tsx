'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile, useUpdateUserMeta, profileKeys } from '@/app/app/_hooks/use-user-profile';
import { useResume, resumeKeys } from '@/app/app/_hooks/use-resumes';
import { updateResumeClient } from '@/app/api/client/resume/resume-client';
import { Skeleton } from '@/app/app/_components/common/skeleton';
import { SheetCard, SectionHeading, PrimaryBtn } from './settings-primitives';

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

// ─────────────────────────────────────────────────────────────────────────────
// SECTION TABS — ordered top-to-bottom
// ─────────────────────────────────────────────────────────────────────────────

const PROFILE_SECTIONS = [
  { key: 'personalInfo', label: 'Personal Info', icon: 'person' },
  { key: 'summary', label: 'Summary', icon: 'notes' },
  { key: 'experience', label: 'Experience', icon: 'work' },
  { key: 'education', label: 'Education', icon: 'school' },
  { key: 'projects', label: 'Projects', icon: 'folder_open' },
  { key: 'skills', label: 'Skills', icon: 'psychology' },
  { key: 'certifications', label: 'Certifications', icon: 'verified' },
  { key: 'achievements', label: 'Achievements', icon: 'emoji_events' },
  { key: 'languages', label: 'Languages', icon: 'language' },
  { key: 'references', label: 'References', icon: 'people' },
] as const;

type ProfileSectionKey = (typeof PROFILE_SECTIONS)[number]['key'];

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ProfileSection() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProfileSectionKey>('personalInfo');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // ── Load user meta + profileResumeId ────────────────────────────────────
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  const profileResumeId = userProfile?.profileResumeId ?? '';

  // ── Load the profile resume (all career sections) ───────────────────────
  const { data: profileResume, isLoading: isResumeLoading } = useResume(profileResumeId);

  // ── Mutations ────────────────────────────────────────────────────────────
  const updateMetaMutation = useUpdateUserMeta();

  // ── Form ─────────────────────────────────────────────────────────────────
  const form = useForm<UpdateResumeDTO>({
    defaultValues: {
      personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '' },
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

  const { reset } = form;
  const isInitialized = useRef<string | null>(null);

  // The User row owns account-level identity while the hidden PROFILE resume
  // owns detailed career data. Fall back to User values for an older/empty
  // profile resume, then persist the merged values on the next explicit save.
  useEffect(() => {
    const initializationKey = profileResumeId || 'user-meta';
    if (
      userProfile &&
      (!profileResumeId || profileResume) &&
      isInitialized.current !== initializationKey
    ) {
      const personalInfo = profileResume?.personalInfo;
      reset({
        personalInfo: {
          fullName: personalInfo?.fullName || userProfile.name || '',
          jobTitle: personalInfo?.jobTitle || userProfile.jobTitle || '',
          email: personalInfo?.email || userProfile.email,
          phone: personalInfo?.phone ?? '',
          location: personalInfo?.location ?? '',
          website: personalInfo?.website ?? '',
          linkedin: personalInfo?.linkedin ?? '',
          github: personalInfo?.github ?? '',
          summary: personalInfo?.summary ?? '',
        },
        experiences: profileResume?.experiences?.map((e) => ({
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
        education: profileResume?.education?.map((e) => ({
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy ?? '',
          startDate: e.startDate,
          endDate: e.endDate ?? '',
          result: e.result ?? '',
          order: e.order,
        })) ?? [],
        projects: profileResume?.projects?.map((p) => ({
          title: p.title,
          field: p.field ?? '',
          startDate: p.startDate ?? '',
          endDate: p.endDate ?? '',
          description: p.description ?? '',
          technologies: p.technologies ?? [],
          link: p.link ?? '',
          order: p.order,
        })) ?? [],
        skills: profileResume?.skills?.map((s) => ({
          name: s.name,
          category: s.category as SkillCategory,
          order: s.order,
        })) ?? [],
        certifications: profileResume?.certifications?.map((c) => ({
          name: c.name,
          issuer: c.issuer ?? '',
          date: c.date ?? '',
          url: c.url ?? '',
          order: c.order,
        })) ?? [],
        achievements: profileResume?.achievements?.map((a) => ({
          title: a.title,
          date: a.date ?? '',
          description: a.description ?? '',
          order: a.order,
        })) ?? [],
        languages: profileResume?.languages?.map((l) => ({
          name: l.name,
          proficiency: l.proficiency as LanguageProficiency,
          order: l.order,
        })) ?? [],
        references: profileResume?.references?.map((r) => ({
          name: r.name,
          designation: r.designation ?? '',
          company: r.company ?? '',
          email: r.email ?? '',
          phone: r.phone ?? '',
          order: r.order,
        })) ?? [],
      });
      isInitialized.current = initializationKey;
    }
  }, [profileResume, profileResumeId, reset, userProfile]);

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaveStatus('saving');
    const values = form.getValues();

    try {
      // 1. Save meta first. This creates the reserved profile resume only on
      // the user's explicit Save Profile action.
      const name = values.personalInfo?.fullName;
      const jobTitle = values.personalInfo?.jobTitle;
      const updatedProfile = await updateMetaMutation.mutateAsync({
        ...(name ? { name } : {}),
        ...(jobTitle ? { jobTitle } : {}),
      });
      const savedProfileResumeId = updatedProfile.profileResumeId;
      if (!savedProfileResumeId) {
        throw new Error('Profile resume was not created');
      }

      // 2. Save career section data to that dedicated profile resume.
      await updateResumeClient(savedProfileResumeId, {
        personalInfo: values.personalInfo,
        experiences: values.experiences,
        education: values.education,
        projects: values.projects,
        skills: values.skills,
        certifications: values.certifications,
        achievements: values.achievements,
        languages: values.languages,
        references: values.references,
      });

      // 3. Refresh query caches
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(savedProfileResumeId) });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('[ProfileSection] Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  const isLoading = isProfileLoading || (!!profileResumeId && isResumeLoading);
  const userInitial = (userProfile?.name ?? userProfile?.email ?? 'U')[0].toUpperCase();

  if (isLoading) {
    return (
      <SheetCard id="profile" className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-8">
          <Skeleton className="w-32 h-40 rounded-sm shrink-0" />
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-10" />)}
          </div>
        </div>
      </SheetCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── User Identity Card ─────────────────────────────────────────── */}
      <SheetCard id="profile" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5b060c]/5 rounded-bl-full pointer-events-none" />

        <SectionHeading icon="account_circle">Career Profile</SectionHeading>

        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#E5D9C8]">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#fff0ed] border-4 border-white shadow-md flex items-center justify-center shrink-0">
            {userProfile?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userProfile.image} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-[32px] font-bold text-[#5b060c]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {userInitial}
              </span>
            )}
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#2b1611]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {userProfile?.name ?? 'Your Name'}
            </p>
            <p className="text-[14px] text-[#564240]" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
              {userProfile?.jobTitle ?? 'Add your professional title →'}
            </p>
            <p className="text-[12px] text-[#8a716f] mt-1" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
              {userProfile?.email}
            </p>
          </div>
        </div>

        {/* ── Section Tab Bar ─────────────────────────────────────────────── */}
        <div className="flex gap-1 flex-wrap mb-6">
          {PROFILE_SECTIONS.map((s) => {
            const isActive = activeTab === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveTab(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5b060c] text-white'
                    : 'bg-[#fff0ed] text-[#564240] hover:bg-[#ffe2db]'
                }`}
                style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* ── Active Section Form ──────────────────────────────────────────── */}
        <form onSubmit={(e) => e.preventDefault()} className="min-h-[200px]">
          {activeTab === 'personalInfo' && <PersonalInfoForm form={form} />}
          {activeTab === 'summary' && <SummaryForm form={form} />}
          {activeTab === 'experience' && <ExperienceForm form={form} />}
          {activeTab === 'education' && <EducationForm form={form} />}
          {activeTab === 'projects' && <ProjectsForm form={form} />}
          {activeTab === 'skills' && <SkillsForm form={form} />}
          {activeTab === 'certifications' && <CertificationsForm form={form} />}
          {activeTab === 'achievements' && <AchievementsForm form={form} />}
          {activeTab === 'languages' && <LanguagesForm form={form} />}
          {activeTab === 'references' && <ReferencesForm form={form} />}
        </form>

        {/* ── Save Footer ──────────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between border-t border-[#E5D9C8] pt-6">
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-[13px]" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
            {saveStatus === 'saving' && (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#5b060c]/20 border-t-[#5b060c] rounded-full animate-spin" />
                <span className="text-[#564240]">Saving profile…</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                <span className="text-emerald-600 font-semibold">Profile saved!</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span className="material-symbols-outlined text-[#ba1a1a] text-base">error</span>
                <span className="text-[#ba1a1a]">Save failed — try again</span>
              </>
            )}
          </div>

          <PrimaryBtn onClick={handleSave} type="button">
            Save Profile
          </PrimaryBtn>
        </div>
      </SheetCard>
    </div>
  );
}
