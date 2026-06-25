interface BadgeProps {
  children: React.ReactNode;
  icon?: string; // Material Symbol name
}

export function Badge({ children, icon }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171c20] border border-[rgba(255,255,255,0.08)]">
      {icon && (
        <span className="material-symbols-outlined text-[#a855f7]" style={{ fontSize: '14px' }}>
          {icon}
        </span>
      )}
      <span className="font-[Space_Grotesk] text-[12px] leading-[16px] tracking-[0.1em] font-semibold text-[#bfc7d4] uppercase">
        {children}
      </span>
    </div>
  );
}
