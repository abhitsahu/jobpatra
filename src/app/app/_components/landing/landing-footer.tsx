import Link from 'next/link';

const exploreLinks = [
  { label: 'Resume Templates', href: '#' },
  { label: 'CV Maker', href: '#' },
  { label: 'Cover Letters', href: '#' },
];

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy', href: '#' },
];

const connectLinks = [
  { label: 'Support', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

const bottomLinks = [
  { label: 'Terms', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Support', href: '#' },
  { label: 'Contact', href: '#' },
];

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#ddc0bd] py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 w-full max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <div className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#5b060c] mb-4">
            JobPatra
          </div>
          <p className="text-[#564240] font-['Hanken_Grotesk'] text-[16px] leading-[24px]">
            Architecting the future of professional storytelling through the lens of timeless
            elegance and AI precision.
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-4">
          <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase text-[#5b060c]">
            Explore
          </h4>
          {exploreLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#564240] hover:text-[#5b060c] transition-colors font-['Hanken_Grotesk']"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase text-[#5b060c]">
            Company
          </h4>
          {companyLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#564240] hover:text-[#5b060c] transition-colors font-['Hanken_Grotesk']"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <h4 className="font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold uppercase text-[#5b060c]">
            Connect
          </h4>
          {connectLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#564240] hover:text-[#5b060c] transition-colors font-['Hanken_Grotesk']"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mt-20 pt-8 border-t border-[#ddc0bd]/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#564240] font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium">
          © 2024 JobPatra. Crafted with professional precision.
        </p>
        <div className="flex gap-8">
          {bottomLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#564240] hover:text-[#5b060c] font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
