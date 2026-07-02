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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk]">Work Experience</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-electric-blue text-[14px] font-medium hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add Role
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-glass-border rounded-xl bg-white/[0.01]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-2">
            work
          </span>
          <p className="text-on-surface-variant text-[14px]">No experience added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isExpanded = expandedIndex === index;
            const errorObj = errors.experiences?.[index];

            return (
              <div
                key={field.id}
                className="relative bg-[rgba(255,255,255,0.02)] backdrop-blur-[20px] border border-glass-border rounded-xl group transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
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
                        className="text-on-surface-variant hover:text-white disabled:opacity-30"
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
                        className="text-on-surface-variant hover:text-white disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">
                          expand_more
                        </span>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[15px] font-semibold text-white">
                        {form.watch(`experiences.${index}.position`) || 'Untitled Position'}
                      </h4>
                      <p className="text-[13px] text-on-surface-variant mt-0.5">
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
                      className="w-8 h-8 rounded-full hover:bg-red-500/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-8 h-8 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-white flex items-center justify-center transition-all"
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
                      className="overflow-hidden border-t border-glass-border"
                    >
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Position */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Job Title / Position
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.position`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Senior Product Designer"
                            />
                            {errorObj?.position && (
                              <span className="text-xs text-error">
                                {errorObj.position.message}
                              </span>
                            )}
                          </div>

                          {/* Company */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Company Name
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.company`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. TechNova Solutions"
                            />
                            {errorObj?.company && (
                              <span className="text-xs text-error">{errorObj.company.message}</span>
                            )}
                          </div>

                          {/* Location */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Location
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.location`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. San Francisco, CA"
                            />
                          </div>

                          {/* Currently working checkbox */}
                          <div className="col-span-2 flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              id={`exp-curr-${index}`}
                              {...register(`experiences.${index}.currentlyWorking`)}
                              className="rounded border-glass-border bg-surface-container-low text-electric-blue focus:ring-electric-blue w-4 h-4"
                            />
                            <label
                              htmlFor={`exp-curr-${index}`}
                              className="text-[13px] text-on-surface"
                            >
                              I currently work here
                            </label>
                          </div>

                          {/* Start Date */}
                          <div className="col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Start Date
                            </label>
                            <input
                              type="text"
                              {...register(`experiences.${index}.startDate`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Mar 2021"
                            />
                            {errorObj?.startDate && (
                              <span className="text-xs text-error">
                                {errorObj.startDate.message}
                              </span>
                            )}
                          </div>

                          {/* End Date */}
                          {!form.watch(`experiences.${index}.currentlyWorking`) && (
                            <div className="col-span-1 flex flex-col gap-1.5">
                              <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                                End Date
                              </label>
                              <input
                                type="text"
                                {...register(`experiences.${index}.endDate`)}
                                className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                                placeholder="e.g. Present"
                              />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                            Description
                          </label>
                          <textarea
                            rows={4}
                            {...register(`experiences.${index}.description`)}
                            className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-3 text-on-surface text-[14px] leading-relaxed focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all resize-none"
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
