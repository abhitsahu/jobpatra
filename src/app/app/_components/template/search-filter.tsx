'use client';
import { IconMapper } from '@/app/_components/icons/IconMapper';

import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchFilterProps) {
  return (
    <section className="sticky top-16 z-40 bg-[#FFF8EE]/90 backdrop-blur-md py-4 px-4 md:px-16 border-y border-[#E5D9C8] mb-12 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-5 py-2 rounded-full font-['Hanken_Grotesk'] text-[13px] font-semibold tracking-wider uppercase transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#5b060c] text-white shadow-md scale-[1.02]'
                    : 'text-[#564240] bg-white/60 border border-[#E5D9C8]/60 hover:bg-[#ffe2db] hover:text-[#5b060c]'
                }`}
              >
                {cat === 'All' ? 'All Designs' : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <IconMapper name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#564240] text-lg pointer-events-none" />
          <input
            className="w-full bg-white font-['Hanken_Grotesk'] text-[15px] text-[#2b1611] py-2 pl-10 pr-4 rounded-full border border-[#E5D9C8] focus:outline-none focus:border-[#5b060c] focus:ring-1 focus:ring-[#5b060c] transition-colors placeholder:text-[#564240]/50 shadow-sm"
            placeholder="Search collection..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#564240] hover:text-[#5b060c]"
            >
              <IconMapper name="close" className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
