'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Feature { id: string; feature: string; available: boolean; highlight: boolean; order: number; }
interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  currency: string;
  limitResumeCreate: number;
  limitAtsAnalysis: number;
  limitAiSuggestion: number;
  limitDownloadPdf: number;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  buttonText: string;
  features: Feature[];
}

interface Props { initialPlans: Plan[]; }

const EMPTY_FORM = {
  name: '', slug: '', description: '', buttonText: 'Get Started',
  monthlyPrice: 0, quarterlyPrice: 0, currency: 'INR',
  limitResumeCreate: 3, limitAtsAnalysis: 5, limitAiSuggestion: 10, limitDownloadPdf: 3,
  isPopular: false, displayOrder: 0,
};

export function PricingAdminClient({ initialPlans }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleUpdate = async (planId: string) => {
    setSaving(true);
    const res = await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: planId, ...form }),
    });
    setSaving(false);
    if (res.ok) { toast.success('Plan updated successfully'); setEditingId(null); router.refresh(); }
    else toast.error('Failed to update plan');
  };

  const handleCreate = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success('Plan created successfully'); setCreating(false); setForm(EMPTY_FORM); router.refresh(); }
    else toast.error('Failed to create plan');
  };

  const handleDelete = async (planId: string, name: string) => {
    if (!confirm(`Delete plan "${name}"? This action cannot be undone.`)) return;
    setDeleting(planId);
    const res = await fetch(`/api/admin/pricing?id=${planId}`, { method: 'DELETE' });
    setDeleting(null);
    if (res.ok) { toast.success('Plan deleted'); router.refresh(); }
    else toast.error('Failed to delete plan');
  };

  const startEdit = (plan: Plan) => {
    setForm({
      name: plan.name, slug: plan.slug, description: plan.description,
      buttonText: plan.buttonText,
      monthlyPrice: plan.monthlyPrice, quarterlyPrice: plan.quarterlyPrice,
      currency: plan.currency,
      limitResumeCreate: plan.limitResumeCreate, limitAtsAnalysis: plan.limitAtsAnalysis,
      limitAiSuggestion: plan.limitAiSuggestion, limitDownloadPdf: plan.limitDownloadPdf,
      isPopular: plan.isPopular, displayOrder: plan.displayOrder,
    });
    setEditingId(plan.id);
  };

  const FIELDS: [string, keyof typeof EMPTY_FORM, string][] = [
    ['Plan Name', 'name', 'text'], ['Unique Slug', 'slug', 'text'], ['Button Text', 'buttonText', 'text'],
    ['Currency Code', 'currency', 'text'],
    ['Monthly Price (₹)', 'monthlyPrice', 'number'], ['Quarterly Price (₹)', 'quarterlyPrice', 'number'],
    ['Resume Limit', 'limitResumeCreate', 'number'], ['ATS Analysis Limit', 'limitAtsAnalysis', 'number'],
    ['AI Suggestion Limit', 'limitAiSuggestion', 'number'], ['PDF Download Limit', 'limitDownloadPdf', 'number'],
    ['Display Order', 'displayOrder', 'number'],
  ];

  const PlanForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5 bg-[#fff8f6] rounded-xl border border-[#ddc0bd] shadow-xs">
      {FIELDS.map(([label, key, type]) => (
        <div key={key}>
          <label className="block text-[11px] text-[#564240] uppercase tracking-wider font-bold mb-1">{label}</label>
          <input
            type={type}
            value={String(form[key])}
            onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-white border border-[#ddc0bd] rounded-lg text-[#2b1611] focus:outline-none focus:border-[#7a1f1f] shadow-2xs"
          />
        </div>
      ))}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <label className="block text-[11px] text-[#564240] uppercase tracking-wider font-bold mb-1">Plan Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-white border border-[#ddc0bd] rounded-lg text-[#2b1611] focus:outline-none focus:border-[#7a1f1f] shadow-2xs"
        />
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#564240] cursor-pointer">
          <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))} className="accent-[#5b060c] w-4 h-4 rounded" />
          Mark as Most Popular
        </label>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#ddc0bd] text-[#564240] hover:bg-[#fff0ed] transition-colors cursor-pointer">Cancel</button>
          <button onClick={onSave} disabled={saving} className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#5b060c] hover:bg-[#7a1f1f] text-white shadow-xs disabled:opacity-50 transition-colors cursor-pointer">
            {saving ? 'Saving…' : 'Save Plan'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 font-['Hanken_Grotesk']">
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-[#564240]">{initialPlans.length} plans configured</p>
        <button
          onClick={() => { setCreating(true); setForm(EMPTY_FORM); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm bg-[#5b060c] hover:bg-[#7a1f1f] text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} /> New Pricing Plan
        </button>
      </div>

      {creating && <PlanForm onSave={handleCreate} onCancel={() => setCreating(false)} />}

      <div className="space-y-4">
        {initialPlans.map((plan) => (
          <div key={plan.id} className="bg-white border border-[#ddc0bd] rounded-xl overflow-hidden shadow-xs">
            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <p className="text-lg font-bold text-[#2b1611] font-['Playfair_Display']">{plan.name}</p>
                  {plan.isPopular && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold uppercase tracking-wide">POPULAR</span>}
                  {!plan.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] font-bold uppercase tracking-wide">INACTIVE</span>}
                </div>
                <p className="text-xs text-[#564240] font-medium">
                  Slug: <span className="font-mono text-[#7a1f1f]">{plan.slug}</span> · <span className="font-bold text-[#166534]">₹{plan.monthlyPrice}</span>/month · <span className="font-bold text-[#166534]">₹{plan.quarterlyPrice}</span>/quarter
                </p>
                <div className="flex gap-4 mt-2 text-xs text-[#564240] font-medium">
                  <span>Resumes: <strong className="text-[#2b1611]">{plan.limitResumeCreate}</strong></span>
                  <span>ATS Analyses: <strong className="text-[#2b1611]">{plan.limitAtsAnalysis}</strong></span>
                  <span>AI Suggestions: <strong className="text-[#2b1611]">{plan.limitAiSuggestion}</strong></span>
                  <span>PDF Downloads: <strong className="text-[#2b1611]">{plan.limitDownloadPdf}</strong></span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {plan.features.map((f) => (
                    <span key={f.id} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${f.available ? 'bg-[#dcfce7] text-[#166534] border border-[#86efac]' : 'bg-[#fff0ed] text-[#564240]/60 border border-[#ddc0bd]/60 line-through'}`}>
                      {f.available ? <Check size={10} /> : <X size={10} />}
                      {f.feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(plan)}
                  className="p-2 rounded-lg hover:bg-[#fff0ed] text-[#564240] hover:text-[#7a1f1f] border border-transparent hover:border-[#ddc0bd] transition-colors cursor-pointer"
                  title="Edit Plan"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.name)}
                  disabled={deleting === plan.id}
                  className="p-2 rounded-lg hover:bg-[#fee2e2] text-[#564240] hover:text-[#991b1b] disabled:opacity-50 transition-colors cursor-pointer"
                  title="Delete Plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {editingId === plan.id && (
              <div className="border-t border-[#ddc0bd] p-5 bg-[#fff8f6]/40">
                <PlanForm onSave={() => handleUpdate(plan.id)} onCancel={() => setEditingId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
