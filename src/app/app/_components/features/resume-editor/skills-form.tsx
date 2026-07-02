'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { SkillCategory } from '@/app/api/model/enums/resume';
import { useState } from 'react';

interface SkillsFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function SkillsForm({ form }: SkillsFormProps) {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>(SkillCategory.TECHNICAL);

  const handleAdd = () => {
    if (!newSkill.trim()) return;
    append({
      name: newSkill.trim(),
      category: newCategory,
      order: fields.length,
    });
    setNewSkill('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk] mb-2">Skills</h3>
        <p className="text-[13px] text-on-surface-variant">
          Add skills and categorize them (e.g. Technical, Soft, Tools/Frameworks).
        </p>
      </div>

      {/* Add Skill Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-glass-border">
        <div className="flex-1">
          <input
            id="skill-name-input"
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            placeholder="e.g. React.js, UI/UX Design, Leadership"
          />
        </div>
        <div className="sm:w-48">
          <select
            id="skill-category-select"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
          >
            {Object.values(SkillCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          id="add-skill-btn"
          type="button"
          onClick={handleAdd}
          className="px-6 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue/90 text-white font-medium text-[14px] transition-colors"
        >
          Add
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-glass-border rounded-xl bg-white/[0.01]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-2">
            psychology
          </span>
          <p className="text-on-surface-variant text-[14px]">No skills added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(SkillCategory).map((cat) => {
            const categorySkills = fields
              .map((f, i) => ({ ...f, index: i }))
              .filter((f) => f.category === cat);
            if (categorySkills.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-[11px] tracking-wider font-bold text-electric-blue uppercase">
                  {cat}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((field) => (
                    <div
                      key={field.id}
                      className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-white/5 border border-glass-border text-white text-[13px]"
                    >
                      <span>{field.name}</span>
                      <button
                        type="button"
                        onClick={() => remove(field.index)}
                        className="w-5 h-5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-white flex items-center justify-center transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
