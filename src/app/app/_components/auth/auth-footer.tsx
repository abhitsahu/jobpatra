import Link from 'next/link';

interface AuthFooterProps {
  prompt: string;
  linkLabel: string;
  href: string;
}

export function AuthFooter({ prompt, linkLabel, href }: AuthFooterProps) {
  return (
    <p className="text-center mt-8 font-[Inter] text-[16px] leading-[24px] text-[#bfc7d4]">
      {prompt}{' '}
      <Link
        href={href}
        className="text-[#1a91f0] hover:text-[#a0caff] font-medium transition-colors"
      >
        {linkLabel}
      </Link>
    </p>
  );
}
