'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reorderFieldArray } from '@/app/app/_util/reorder';

interface ExperienceFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function ExperienceForm({ form }: ExperienceFormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experiences',
  });

  // Track which items are expanded (index-based)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(fields.length > 0 ? 0 : null);

  const handleAdd = () => {
    append({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      highlights: [],
      order: fields.length,
    });
    setExpandedIndex(fields.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-bold text-[#7a1f1f] font-['Playfair_Display']">
          Work Experience
        </h3>
        {fields.length > 0 && (
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 text-[#7a1f1f] text-[14px] font-bold hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Role
          </button>
        )}
      </div>

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-12 border-2 border-dashed border-[#ddc0bd] rounded-xl flex flex-col items-center justify-center text-[#564240] hover:border-[#7a1f1f]/50 hover:bg-[#fff8f6] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#fff0ed] flex items-center justify-center mb-3 group-hover:bg-[#ffe2db] transition-colors">
            <span className="material-symbols-outlined text-2xl text-[#7a1f1f]">add</span>
          </div>
          <h4 className="font-['Playfair_Display'] text-[18px] leading-[24px] font-bold text-[#7a1f1f] mb-1">
            + Add Experience
          </h4>
          <p className="text-[12px] leading-[16px] text-[#564240]/60 font-['Hanken_Grotesk'] font-medium">
            Start building your work history.
          </p>
        </button>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isExpanded = expandedIndex === index;
            const errorObj = errors.experiences?.[index];

            return (
              <div
                key={field.id}
                className="relative bg-white border border-[#ddc0bd] rounded-xl group transition-all duration-300 shadow-sm overflow-hidden"
              >
                {/* Expand/Collapse Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    {/* Reordering */}
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderFieldArray(index, 'up', move);
                        }}
                        className="text-[#564240] hover:text-[#7a1f1f] disabled:opacity-30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">
                          expand_less
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={index === fields.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderFieldArray(index, 'down', move);
                        }}
                        className="text-[#564240] hover:text-[#7a1f1f] disabled:opacity-30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">
                          expand_more
                        </span>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[15px] font-semibold text-[#2b1611]">
                        {form.watch(`experiences.${index}.position`) || 'Untitled Position'}
                      </h4>
                      <p className="text-[13px] text-[#564240]/80 mt-0.5 font-['Hanken_Grotesk']">
                        {form.watch(`experiences.${index}.company`) || 'Company Name'} ·{' '}
                        {form.watch(`experiences.${index}.startDate`) || 'Start Date'} -{' '}
                        {form.watch(`experiences.${index}.currentlyWorking`)
                          ? 'Present'
                          : form.watch(`experiences.${index}.endDate`) || 'End Date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-8 h-8 rounded-full hover:bg-red-500/10 text-[#564240] hover:text-[#7a1f1f] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-8 h-8 rounded-full hover:bg-[#fff0ed] text-[#564240] hover:text-[#7a1f1f] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#ddc0bd]/60"
                    >
                      <div className="p-6 space-y-4 bg-[#fff8f6]/30">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Position */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                              Job Title / Position
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.position`)}
                              className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
                              placeholder="e.g. Senior Product Designer"
                            />
                            {errorObj?.position && (
                              <span className="text-xs text-[#7a1f1f]">
                                {errorObj.position.message}
                              </span>
                            )}
                          </div>

                          {/* Company */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                              Company Name
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.company`)}
                              className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
                              placeholder="e.g. TechNova Solutions"
                            />
                            {errorObj?.company && (
                              <span className="text-xs text-[#7a1f1f]">
                                {errorObj.company.message}
                              </span>
                            )}
                          </div>

                          {/* Location */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                              Location
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.location`)}
                              className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
                              placeholder="e.g. San Francisco, CA"
                            />
                          </div>

                          {/* Currently working checkbox */}
                          <div className="col-span-2 flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              id={`exp-curr-${index}`}
                              {...register(`experiences.${index}.currentlyWorking`)}
                              className="rounded border-[#ddc0bd] bg-white text-[#7a1f1f] focus:ring-[#7a1f1f]/20 w-4 h-4 cursor-pointer"
                            />
                            <label
                              htmlFor={`exp-curr-${index}`}
                              className="text-[13px] text-[#2b1611] font-medium font-['Hanken_Grotesk'] cursor-pointer"
                            >
                              I currently work here
                            </label>
                          </div>

                          {/* Start Date */}
                          <div className="col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                              Start Date
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.startDate`)}
                              className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
                              placeholder="e.g. Mar 2021"
                            />
                            {errorObj?.startDate && (
                              <span className="text-xs text-[#7a1f1f]">
                                {errorObj.startDate.message}
                              </span>
                            )}
                          </div>

                          {/* End Date */}
                          {!form.watch(`experiences.${index}.currentlyWorking`) && (
                            <div className="col-span-1 flex flex-col gap-1.5">
                              <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                                End Date
                              </label>
                              <input
                                type="text"
                                {...register(`experiences.${index}.endDate`)}
                                className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-2.5 text-[#2b1611] text-[15px] focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all font-['Hanken_Grotesk']"
                                placeholder="e.g. Present"
                              />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-[#564240] uppercase tracking-wider">
                            Description
                          </label>
                          <textarea
                            rows={4}
                            {...register(`experiences.${index}.description`)}
                            className="w-full bg-white border border-[#ddc0bd] rounded-lg px-4 py-3 text-[#2b1611] text-[14px] leading-relaxed focus:outline-none focus:border-[#7a1f1f] focus:ring-4 focus:ring-[#7a1f1f]/5 transition-all resize-none font-['Hanken_Grotesk']"
                            placeholder="Spearheaded the redesign of the core platform, increasing user retention by 24%..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
