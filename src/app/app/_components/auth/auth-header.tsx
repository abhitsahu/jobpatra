interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="font-[Space_Grotesk] text-[32px] leading-[40px] font-semibold text-[#dfe3e9] mb-3">
        {title}
      </h1>
      <p className="font-[Inter] text-[16px] leading-[24px] text-[#bfc7d4]">{subtitle}</p>
    </div>
  );
}
