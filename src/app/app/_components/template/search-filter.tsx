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
    <section className="max-w-7xl mx-auto px-4 md:px-16 mb-12">
      <div className="bg-[#fff0ed] p-6 rounded-xl border border-[#ddc0bd] shadow-sm flex flex-col md:flex-row gap-6 items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#564240]">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#ddc0bd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b060c] focus:border-transparent font-['Hanken_Grotesk'] text-[16px] leading-[24px] text-[#2b1611]"
            placeholder="Search templates..."
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#5b060c] text-white shadow-sm'
                    : 'border border-[#ddc0bd] text-[#564240] hover:bg-[#ffe2db] hover:text-[#5b060c]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
