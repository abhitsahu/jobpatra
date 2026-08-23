'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '../../_components/template/hero';
import { SearchFilter } from '../../_components/template/search-filter';
import { TemplateGrid } from '../../_components/template/template-grid';
import { WhyChoose } from '../../_components/template/why-choose';
import { CtaSection } from '../../_components/template/cta-section';
import { PreviewModal } from '../../_components/template/preview-modal';
import type { TemplateData } from '../../_components/template/template-card';
import { getSessionClient } from '@/app/api/client/auth/auth-client';

const STATIC_TEMPLATES: TemplateData[] = [
  {
    id: 'classic-demo',
    name: 'The Executive',
    slug: 'classic-demo',
    category: 'Executive',
    description: 'Command authority with classical serif typography and a structured layout ideal for senior roles.',
    previewImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Vy_u0uTQqMVvTzjNtFIULskQG61o4tFa2NQfkCFbR5Ov5bYCXblDEcRAx8fFglEojKZFi8Gr4nDYnF5RGq3BHZKymC7mvA3AN7LKCLULbS9ANhHmeSS5pR7_iumWanRaBuTUQB8wQWJE4t35KtDDpcIBGETYFza4A0sWcPEfDXGGRuI6szh6iE7psyXbCwHT5O9MFk92j1zmu9bWb0oheCQailTHSqWJ0nes3cW70sWoECIc_-2rbhur51',
    atsFriendly: true,
    isPremium: true,
    usageCount: 12800,
    tag: 'PREMIUM',
    rotateClass: 'group-hover:rotate-1',
  },
  {
    id: 'vanguard',
    name: 'The Modernist',
    slug: 'vanguard',
    category: 'Modern',
    description: 'Crisp sans-serif fonts and subtle accents create a forward-looking aesthetic perfect for tech and SaaS.',
    previewImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1X4UBHOpwlVOdd7UQyuXAdoP-3rCR0ATP2HNzy3HRkJz5D8AMnYPMAe5C1-qyNGxpdQMJaIdX1Yxxh_SIrRACkO4eXyBRklwRTsERbagpXhLrMzmDl_TRDV1NCV0m8wqvo4dy_XBRhrhWeGVrIMjQDu4MN9NwX2x3X1nxsfRk8MvHD1l79aL0Bpo33KSx3SFtS4_tuy70X5QKWtQbX_m94QOUhKjgu9FLNUu68YhSQDWJLjjo7J3hsA8iJ5',
    atsFriendly: true,
    isPremium: false,
    usageCount: 24500,
    tag: 'POPULAR',
    rotateClass: 'group-hover:-rotate-1',
  },
  {
    id: 'minimalist',
    name: 'The Architect',
    slug: 'minimalist',
    category: 'Minimalist',
    description: 'Maximum readability with intentional whitespace. A highly scannable layout designed specifically for ATS systems.',
    previewImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1VH3FNyrI24OZ3cSwfU3v3SstbjwAOlJrPz-Cs1ubQLLSpyzmhK3PRDQeqGiJxTr7hj2YTREaJPp5kvmEMZShZqdSZEyCQplcl2yTAVHRi0CpJI5OqLPmZHfIZ6tOj8WfqBWJ7iIQx63phognvki5U206UG_qIs5bxjzBlSrG9vpmX-StrIIdgZZQPHNdDnxtKbjntkaPJSTks_NCCQQ3omZt2W6gJeyoHjp8SHEBJ-32zw_cfxJAAFGvrf',
    atsFriendly: true,
    isPremium: false,
    usageCount: 9800,
    tag: 'ATS OK',
    rotateClass: 'group-hover:rotate-1',
  },
  {
    id: 'professional',
    name: 'The Professional',
    slug: 'professional',
    category: 'Professional',
    description: 'A balanced layout for mid-career professionals across all industries with crisp typography.',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBocww33dWB2nn9332CLZN094hbw83eKT2lZD5exFo1VxHeLAhUwyyO_RIZa6OmD0aPN50YDt2YFxWLnUWEJF6XPgcwUkxkABi6eVkvSrexB_ZPK5T3UT83wQ6Cr9Ps9KLKupaRkg-lk963r_zmbTNL3HNOT1GgfLb60ftJFkU4x3JTScrhnKNRfoQ2tbUSTQX6jPvZg2hFKsrCjTiMh9HDgvq7-SGOcekBPHUk-kFY5AtGzFXTa7ETYz6daTe2NVdez2-4xlT7Opsz',
    atsFriendly: true,
    isPremium: false,
    usageCount: 18900,
    tag: 'NEW',
    rotateClass: 'group-hover:-rotate-1',
  },
  {
    id: 'creative-edge',
    name: 'Creative Edge',
    slug: 'creative-edge',
    category: 'Creative',
    description: 'Stand out with a unique sidebar and modern typography tailored for creative disciplines.',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zFvQfK0AP_7OH2vmg9zg98CKKhMJs5V9DITctTXRvVmiachKaMHIMWBg-ovvUdMnO7GAHL3jItYNVhkVraSmhQuBpVT_egfewp28Ig6QCIVFG-zFAQbhEGbIwX-FaZIcWdf9h5pol0XdfeOgcPKM42q_nayaP18x32do4LnJZmLo3IsfK2kgnDkLbxgI7wIl4RrvXDYyu_R8PhyPWHgKr7Ax7s77a9erM29TI5hWe4iuI2o3oxnGPDW4Y3WW-USzy55XGu3rlE5W',
    atsFriendly: false,
    isPremium: false,
    usageCount: 15600,
    tag: 'CREATIVE',
    rotateClass: 'group-hover:rotate-1',
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    slug: 'executive-suite',
    category: 'Executive',
    description: 'High-level summary and strategic layout for senior leaders and C-suite executives.',
    previewImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0HkxkYVdqvg0ZDj3Q9K084SUwjLT3b-wK5YLVWj5G4XudNLCJ39SyiRwuMw69p_yV-XfkjSQ4-DsFZ7QpwPtbm0SPuzLIfWm3JcpJ_dEUhDNEcfEy4tyUC4ccob2c0KkNLPdgDYo18iB_5tLFgnk0xX1yu6CdmJxeBRMW30liwiLUuGQDKi6nA7ybCG_DEGF05erQanuR8j8Ih0V7gCLJcBysggTx_R-wwtiMLl2EthlIM-XpNo6LoFAfUKZLN_aycjNcJn-iWCQY',
    atsFriendly: true,
    isPremium: true,
    usageCount: 8200,
    tag: 'PREMIUM',
    rotateClass: 'group-hover:-rotate-1',
  },
];

export default function TemplatesClient() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>(STATIC_TEMPLATES);
  const [categories, setCategories] = useState<string[]>([
    'All',
    'Executive',
    'Modern',
    'Minimalist',
    'Professional',
    'Creative',
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch live templates from API if available
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch('/api/template');
        const data = await res.json();
        if (data.success && data.data?.templates?.length > 0) {
          setTemplates(data.data.templates);
          if (data.data.categories?.length > 0) {
            setCategories(data.data.categories);
          }
        }
      } catch (err) {
        console.warn('Using static templates fallback:', err);
      }
    }
    loadTemplates();
  }, []);

  // Filter templates based on search & category selection
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'ATS Friendly' && t.atsFriendly) ||
      t.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = async (id: string) => {
    const session = await getSessionClient();
    if (session?.user) {
      router.push(`/app/resume/new?template=${encodeURIComponent(id)}`);
    } else {
      router.push(
        `/app/login?redirect=${encodeURIComponent('/app/resume/new')}&template=${encodeURIComponent(id)}`,
      );
    }
  };

  const handlePreview = (id: string) => {
    const tpl = templates.find((t) => t.id === id) || null;
    setPreviewTemplate(tpl);
    setIsModalOpen(true);
  };

  const handleStartBuilding = async () => {
    const session = await getSessionClient();
    if (session?.user) {
      router.push('/app/resume/new');
    } else {
      router.push(`/app/login?redirect=${encodeURIComponent('/app/resume/new')}`);
    }
  };

  const handleBrowsePlans = () => {
    router.push('/app/pricing');
  };

  return (
    <div className="min-h-screen text-[#2b1611] bg-[#FFF8EE]">
      {/* Dynamic Keyframe Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />

      {/* Main Content Sections */}
      <div className="pb-16 space-y-4">
        <Hero />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <TemplateGrid
          templates={filteredTemplates}
          onUseTemplate={handleUseTemplate}
          onPreview={handlePreview}
        />

        <WhyChoose />

        <CtaSection onStartBuilding={handleStartBuilding} onBrowsePlans={handleBrowsePlans} />
      </div>

      {/* Template Preview Modal */}
      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={previewTemplate}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}
