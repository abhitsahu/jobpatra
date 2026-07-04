/**
 * Reusable primitives for the Settings page.
 * These follow the JobPatra paper/Burgundy design language.
 */

import { cn } from '@/app/app/_util/cn';

// ─── Sheet Card ────────────────────────────────────────────────────────────────
export function SheetCard({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn('rounded-xl p-8', className)}
      style={{
        background: '#FFF8EE',
        border: '1px solid #E5D9C8',
        boxShadow: '0 4px 10px rgba(78,52,46,0.04)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
export function SectionHeading({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {icon && <span className="material-symbols-outlined text-[#5b060c]">{icon}</span>}
      <h3
        className="text-[24px] leading-[32px] font-semibold text-[#5b060c]"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {children}
      </h3>
    </div>
  );
}

// ─── Paper Input ──────────────────────────────────────────────────────────────
export function PaperInput({
  label,
  type = 'text',
  defaultValue,
  placeholder,
  className,
  colSpan2,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  colSpan2?: boolean;
}) {
  return (
    <div className={cn('space-y-1', colSpan2 && 'col-span-2', className)}>
      <label
        className="text-[12px] leading-[16px] font-semibold text-[#564240] uppercase tracking-[0.05em]"
        style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
      >
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-[#ddc0bd] focus:border-[#5b060c] focus:outline-none py-2 text-[#2b1611] transition-colors"
        style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: 15 }}
      />
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
export function Toggle({ on = true }: { on?: boolean }) {
  return (
    <div
      className="relative inline-block cursor-pointer transition-colors rounded-full"
      style={{
        width: 44,
        height: 24,
        background: on ? '#5b060c' : '#ddc0bd',
        flexShrink: 0,
      }}
    >
      <div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
        style={{ [on ? 'right' : 'left']: 4 }}
      />
    </div>
  );
}

// ─── Row Item (for Account/Settings rows) ────────────────────────────────────
export function SettingsRow({
  label,
  description,
  children,
  bordered = true,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-4',
        bordered && 'border-b border-[#E5D9C8]',
      )}
    >
      <div>
        <p
          className="text-[14px] font-semibold text-[#2b1611] leading-[20px]"
          style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
        >
          {label}
        </p>
        {description && (
          <p
            className="text-[13px] text-[#564240] mt-0.5"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Burgundy Primary Button ──────────────────────────────────────────────────
export function PrimaryBtn({
  children,
  onClick,
  className,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'bg-[#5b060c] text-white px-8 py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity',
        className,
      )}
      style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
    >
      {children}
    </button>
  );
}

// ─── Outline Button ───────────────────────────────────────────────────────────
export function OutlineBtn({
  children,
  onClick,
  className,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-lg text-[14px] font-semibold border transition-all',
        danger
          ? 'border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white'
          : 'border-[#8a716f] text-[#564240] hover:bg-[#fff0ed]',
        className,
      )}
      style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
    >
      {children}
    </button>
  );
}

// ─── Gold Wax Seal Badge ──────────────────────────────────────────────────────
export function WaxSeal() {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #f6be39, #795900)',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(0,0,0,0.3)',
        border: '2px solid #5c4300',
      }}
    >
      <span
        className="material-symbols-outlined text-white"
        style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}
      >
        workspace_premium
      </span>
    </div>
  );
}
