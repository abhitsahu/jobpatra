import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}

const baseClass =
  'inline-flex items-center justify-center gap-2 font-[Space_Grotesk] text-[14px] font-medium px-8 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer';

const variants = {
  primary:
    'bg-gradient-to-r from-[#2e358a] to-[#1a91f0] text-white shadow-[0_0_20px_-5px_rgba(26,145,240,0.4)] hover:opacity-90',
  secondary: 'bg-white/5 border border-[rgba(255,255,255,0.08)] text-[#dfe3e9] hover:bg-white/10',
};

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  const classes = `${baseClass} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
