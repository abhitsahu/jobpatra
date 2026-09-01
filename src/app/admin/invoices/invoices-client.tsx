'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Download, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  status: string;
  pdfUrl: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

interface Props {
  initialInvoices: Invoice[];
  total: number;
  page: number;
  totalPages: number;
}

export function AdminInvoicesClient({ initialInvoices, total, page, totalPages }: Props) {
  const router = useRouter();
  const [resending, setResending] = useState<string | null>(null);
  const fmt = (n: number, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

  const handleResend = async (id: string) => {
    setResending(id);
    const res = await fetch(`/api/admin/invoices/${id}/resend`, { method: 'POST' });
    setResending(null);
    if (res.ok) toast.success('Invoice email resent successfully');
    else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.message ?? 'Failed to resend email');
    }
  };

  return (
    <div className="space-y-4 font-['Hanken_Grotesk']">
      <p className="text-xs font-semibold text-[#564240]">{total} total invoices generated</p>
      <div className="bg-white border border-[#ddc0bd] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ddc0bd] bg-[#fff8f6] text-[#564240] text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-bold">Invoice #</th>
                <th className="text-left px-5 py-3.5 font-bold">User</th>
                <th className="text-left px-5 py-3.5 font-bold">Amount</th>
                <th className="text-left px-5 py-3.5 font-bold hidden md:table-cell">Date</th>
                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ddc0bd]/50">
              {initialInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#fff0ed]/40 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#7a1f1f]">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#2b1611]">{inv.user.name ?? '—'}</p>
                    <p className="text-xs text-[#564240] mt-0.5">{inv.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#166534]">{fmt(inv.total, inv.currency)}</td>
                  <td className="px-5 py-3.5 text-xs text-[#564240] font-medium hidden md:table-cell">
                    {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-[#fff0ed] text-[#564240] hover:text-[#7a1f1f] transition-colors"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => handleResend(inv.id)}
                        disabled={resending === inv.id}
                        className="p-1.5 rounded-lg hover:bg-[#fff0ed] text-[#564240] hover:text-[#7a1f1f] disabled:opacity-50 transition-colors cursor-pointer"
                        title="Resend email to user"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-[#ddc0bd] px-5 py-3.5 bg-[#fff8f6]/50 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#564240]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <a
                href={`/admin/invoices?page=${page - 1}`}
                className={`p-1.5 rounded-lg bg-white hover:bg-[#fff0ed] border border-[#ddc0bd] text-[#564240] hover:text-[#2b1611] transition-colors shadow-2xs ${page <= 1 ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronLeft size={16} />
              </a>
              <a
                href={`/admin/invoices?page=${page + 1}`}
                className={`p-1.5 rounded-lg bg-white hover:bg-[#fff0ed] border border-[#ddc0bd] text-[#564240] hover:text-[#2b1611] transition-colors shadow-2xs ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
              >
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
