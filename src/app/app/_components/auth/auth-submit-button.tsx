'use client';

interface AuthSubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  label,
  loading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full bg-gradient-to-r from-[#2e358a] to-[#1a91f0] text-white py-3.5 rounded-full font-[Space_Grotesk] text-[14px] leading-[20px] font-medium shadow-[0_4px_14px_0_rgba(26,145,240,0.2)] hover:shadow-[0_6px_20px_rgba(26,145,240,0.4)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group mt-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(26,145,240,0.2)]"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <>
            {label}
            <span
              className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1"
              style={{ fontSize: '18px' }}
            >
              arrow_forward
            </span>
          </>
        )}
      </span>
    </button>
  );
}
