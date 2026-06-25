interface LogoProps {
  size?: 'sm' | 'md';
}

export function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? '28px' : '32px';
  const textClass = size === 'sm' ? 'text-2xl' : 'text-[32px]';

  return (
    <div className="flex items-center gap-3">
      <span
        className="material-symbols-outlined text-[#1a91f0]"
        style={{ fontVariationSettings: "'FILL' 1", fontSize: iconSize }}
      >
        psychiatry
      </span>
      <span
        className={`font-[Space_Grotesk] font-semibold tracking-tight text-[#dfe3e9] ${textClass}`}
      >
        Elevate AI
      </span>
    </div>
  );
}
