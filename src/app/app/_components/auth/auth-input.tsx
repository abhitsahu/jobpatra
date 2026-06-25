'use client';

import { forwardRef } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string; // Material Symb  ol name e.g. "mail"
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, icon, error, rightElement, id, ...inputProps },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label
        htmlFor={inputId}
        className="font-[Space_Grotesk] text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#bfc7d4] uppercase block mb-2 ml-1"
      >
        {label}
      </label>

      <div className="relative">
        {/* Left icon */}
        <span
          className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#bfc7d4] pointer-events-none"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {icon}
          </span>
        </span>

        <input
          ref={ref}
          id={inputId}
          {...inputProps}
          className={[
            'w-full bg-[#1b2024] border rounded-lg py-3 pl-11 text-[#dfe3e9] outline-none transition-all duration-200 placeholder:text-[#bfc7d4]/50 font-[Inter] text-[16px]',
            rightElement ? 'pr-12' : 'pr-4',
            error
              ? 'border-[#ffb4ab] focus:border-[#ffb4ab] focus:ring-1 focus:ring-[#ffb4ab]'
              : 'border-[rgba(255,255,255,0.08)] focus:border-[#1a91f0] focus:ring-1 focus:ring-[#1a91f0]',
            inputProps.className ?? '',
          ].join(' ')}
        />

        {/* Right slot (used by PasswordInput for eye toggle) */}
        {rightElement}
      </div>

      {/* Inline validation message */}
      {error && (
        <p className="mt-1.5 ml-1 font-[Inter] text-[12px] text-[#ffb4ab]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
