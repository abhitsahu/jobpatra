'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reorderFieldArray } from '@/app/app/_util/reorder';

interface EducationFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function EducationForm({ form }: EducationFormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'education',
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(fields.length > 0 ? 0 : null);

  const handleAdd = () => {
    append({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      result: '',
      order: fields.length,
    });
    setExpandedIndex(fields.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk]">Education</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-electric-blue text-[14px] font-medium hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add Education
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-glass-border rounded-xl bg-white/[0.01]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-2">
            school
          </span>
          <p className="text-on-surface-variant text-[14px]">No education details added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isExpanded = expandedIndex === index;
            const errorObj = errors.education?.[index];

            return (
              <div
                key={field.id}
                className="relative bg-[rgba(255,255,255,0.02)] backdrop-blur-[20px] border border-glass-border rounded-xl group transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)]"
              >
                {/* Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <div className="flex items-center gap-3">
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
                        {form.watch(`education.${index}.degree`) || 'Degree / Diploma'}
                      </h4>
                      <p className="text-[13px] text-on-surface-variant mt-0.5">
                        {form.watch(`education.${index}.institution`) || 'Institution'} ·{' '}
                        {form.watch(`education.${index}.startDate`) || 'Start'} -{' '}
                        {form.watch(`education.${index}.endDate`) || 'End'}
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
                          {/* Degree */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Degree / Certificate
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.degree`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. B.S. Interaction Design"
                            />
                            {errorObj?.degree && (
                              <span className="text-xs text-error">{errorObj.degree.message}</span>
                            )}
                          </div>

                          {/* Institution */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              School / Institution
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.institution`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. California College of the Arts"
                            />
                            {errorObj?.institution && (
                              <span className="text-xs text-error">
                                {errorObj.institution.message}
                              </span>
                            )}
                          </div>

                          {/* Field of study */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.fieldOfStudy`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Interaction Design"
                            />
                          </div>

                          {/* Result */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Result / Grade / GPA
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.result`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. 3.8 / 4.0"
                            />
                          </div>

                          {/* Start Date */}
                          <div className="col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Start Date
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.startDate`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. 2014"
                            />
                            {errorObj?.startDate && (
                              <span className="text-xs text-error">
                                {errorObj.startDate.message}
                              </span>
                            )}
                          </div>

                          {/* End Date */}
                          <div className="col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              End Date
                            </label>
                            <input
                              type="text"
                              {...register(`education.${index}.endDate`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. 2018"
                            />
                          </div>
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
