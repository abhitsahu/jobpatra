'use client';

import { useFieldArray, UseFormReturn } from 'react-hook-form';
import type { UpdateResumeDTO } from '@/app/api/model/request/resume/resume';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reorderFieldArray } from '@/app/app/_util/reorder';

interface ReferencesFormProps {
  form: UseFormReturn<UpdateResumeDTO>;
}

export function ReferencesForm({ form }: ReferencesFormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'references',
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(fields.length > 0 ? 0 : null);

  const handleAdd = () => {
    append({
      name: '',
      designation: '',
      company: '',
      email: '',
      phone: '',
      order: fields.length,
    });
    setExpandedIndex(fields.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[20px] font-bold text-white font-[Space_Grotesk]">References</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-electric-blue text-[14px] font-medium hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add Reference
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-glass-border rounded-xl bg-white/[0.01]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 block mb-2">
            group
          </span>
          <p className="text-on-surface-variant text-[14px]">No references added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const isExpanded = expandedIndex === index;
            const errorObj = errors.references?.[index];

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
                        {form.watch(`references.${index}.name`) || 'Reference Name'}
                      </h4>
                      <p className="text-[13px] text-on-surface-variant mt-0.5">
                        {form.watch(`references.${index}.designation`) || 'Designation'} ·{' '}
                        {form.watch(`references.${index}.company`) || 'Company'}
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
                          {/* Name */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Reference Name
                            </label>
                            <input
                              type="text"
                              {...register(`references.${index}.name`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Dr. Jane Smith"
                            />
                            {errorObj?.name && (
                              <span className="text-xs text-error">{errorObj.name.message}</span>
                            )}
                          </div>

                          {/* Designation */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Designation / Job Title
                            </label>
                            <input
                              type="text"
                              {...register(`references.${index}.designation`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Director of Engineering"
                            />
                          </div>

                          {/* Company */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Company
                            </label>
                            <input
                              type="text"
                              {...register(`references.${index}.company`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="e.g. Google LLC"
                            />
                          </div>

                          {/* Email */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Email Address
                            </label>
                            <input
                              type="email"
                              {...register(`references.${index}.email`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="janesmith@company.com"
                            />
                            {errorObj?.email && (
                              <span className="text-xs text-error">{errorObj.email.message}</span>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                            <label className="text-[11px] tracking-wider font-semibold text-on-surface-variant uppercase">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              {...register(`references.${index}.phone`)}
                              className="w-full bg-surface-container-low border border-glass-border rounded-lg px-4 py-2.5 text-on-surface text-[15px] focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
                              placeholder="+1 (555) 012-3456"
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
